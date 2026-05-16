import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import 'package:logger/logger.dart';

import '../models/invoice_model.dart';
import '../services/realm_service.dart';
import '../services/sync_service.dart';
import '../services/api_service.dart';
import '../config/app_config.dart';

/// State management for invoices
/// Handles: create, read, update, offline persistence
class InvoiceProvider extends ChangeNotifier {
  final _uuid = const Uuid();
  final _logger = Logger();
  final _syncService = SyncService(apiService: ApiService());

  List<InvoiceModel> _invoices = [];
  bool _isLoading = false;
  String? _error;

  List<InvoiceModel> get invoices => _invoices;
  bool get isLoading => _isLoading;
  String? get error => _error;

  /// Load all invoices from local Realm
  void loadInvoices() {
    _invoices = RealmService.getAllInvoices().toList();
    notifyListeners();
  }

  /// Load invoices for a specific trip
  void loadInvoicesForTrip(String tripId) {
    _invoices = RealmService.getInvoicesByTrip(tripId).toList();
    notifyListeners();
  }

  /// Create a new invoice (saved locally immediately, queued for sync)
  /// Returns the created invoice or null on failure
  Future<InvoiceModel?> createInvoice({
    required String tripId,
    required String photographerId,
    required String deviceId,
    required String guestName,
    required String guestContact,
    String? guestHotel,
    String? guestRoom,
    required double totalAmount,
    String currency = AppConfig.defaultCurrency,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Get next sequence number (offline-safe)
      final sequence = RealmService.getNextSequence(tripId, photographerId);

      // Generate serial number (format: tripid-photoid-sequence)
      final shortTripId = 'TRIP-${DateTime.now().toString().split(' ')[0].replaceAll('-', '')}';
      final shortPhotoId = 'PHOTO-${photographerId.substring(0, 3).toUpperCase()}';
      final serialNumber = RealmService.generateSerialNumber(
        shortTripId,
        shortPhotoId,
        sequence,
      );

      // Create invoice object
      final invoice = InvoiceModel(
        _uuid.v4(),
        tripId: tripId,
        photographerId: photographerId,
        serialNumber: serialNumber,
        serialSequence: sequence,
        guestName: guestName,
        guestContact: guestContact,
        guestHotel: guestHotel,
        guestRoom: guestRoom,
        totalAmount: totalAmount,
        currency: currency,
        createdAtLocal: DateTime.now(),
        status: 'draft',
        isSynced: false,
        retryCount: 0,
        deviceId: deviceId,
        mediaCount: 0,
      );

      // Save locally FIRST (offline-first guarantee)
      await RealmService.saveInvoice(invoice);
      _logger.i('Invoice created locally: ${invoice.serialNumber}');

      // Queue for sync (fire-and-forget, happens when online)
      await _syncService.queueInvoiceSync(invoice);

      // Refresh local list
      _invoices = RealmService.getAllInvoices().toList();

      _isLoading = false;
      notifyListeners();
      return invoice;

    } catch (e) {
      _logger.e('Failed to create invoice: $e');
      _error = 'Failed to create invoice. Please try again.';
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }

  /// Finalize invoice (ready for media delivery)
  Future<bool> finalizeInvoice(String invoiceId) async {
    try {
      await RealmService.updateInvoiceStatus(invoiceId, 'finalized');
      loadInvoices();
      return true;
    } catch (e) {
      _logger.e('Failed to finalize invoice: $e');
      return false;
    }
  }

  int get unsyncedCount {
    return RealmService.getUnsyncedInvoices().length;
  }
}
