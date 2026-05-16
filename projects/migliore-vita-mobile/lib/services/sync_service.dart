import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:logger/logger.dart';

import '../models/invoice_model.dart';
import 'realm_service.dart';

/// Simplified sync service for MiglioreVita POS
/// Connects to backend at http://5.189.160.78:3000/sync
class SyncService {
  final _logger = Logger();
  static const String _syncUrl = 'http://5.189.160.78:3000/sync';

  // ── Public API ─────────────────────────────────────────────────────────

  /// Queue an invoice for sync (call immediately after local save)
  Future<void> queueInvoiceSync(InvoiceModel invoice) async {
    final payload = jsonEncode({
      'id': invoice.id,
      'trip_id': invoice.tripId,
      'photographer_id': invoice.photographerId,
      'serial_number': invoice.serialNumber,
      'serial_sequence': invoice.serialSequence,
      'guest_name': invoice.guestName,
      'guest_contact': invoice.guestContact,
      'guest_hotel': invoice.guestHotel,
      'guest_room': invoice.guestRoom,
      'total_amount': invoice.totalAmount,
      'currency': invoice.currency,
      'created_at_local': invoice.createdAtLocal.toIso8601String(),
      'device_id': invoice.deviceId,
    });

    // Store locally (RealmDB)
    await RealmService.addInvoice(invoice);
    _logger.d('Invoice queued for sync: ${invoice.id}');
  }

  /// Sync data with backend
  Future<Map<String, dynamic>> syncData(Map<String, dynamic> data) async {
    try {
      final response = await http.post(
        Uri.parse(_syncUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(data),
      );

      if (response.statusCode == 200) {
        final result = jsonDecode(response.body);
        _logger.i('Sync successful: $result');
        return result;
      } else {
        throw Exception('Failed to sync: ${response.statusCode}');
      }
    } catch (e) {
      _logger.e('Sync error: $e');
      throw Exception('Sync error: $e');
    }
  }

  /// Get count of pending sync items (for UI badge)
  int getPendingCount() {
    return RealmService.getPendingInvoices().length;
  }
}
}
