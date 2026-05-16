import 'package:realm/realm.dart';
import '../models/invoice_model.dart';
import '../models/trip_model.dart';
import '../models/media_model.dart';
import '../models/sync_queue_model.dart';
import 'package:logger/logger.dart';

/// Central service for all Realm (local database) operations
/// This is the single source of truth for offline data
class RealmService {
  static Realm? _realm;
  static final _logger = Logger();

  // Singleton access
  static Realm get instance {
    if (_realm == null) {
      throw StateError('RealmService not initialized. Call initialize() first.');
    }
    return _realm!;
  }

  /// Initialize Realm database on app startup
  static Future<void> initialize() async {
    final config = Configuration.local(
      [
        InvoiceModel.schema,
        TripModel.schema,
        MediaModel.schema,
        SyncQueueModel.schema,
      ],
      schemaVersion: 1,
      migrationCallback: _onMigration,
    );

    _realm = Realm(config);
    _logger.i('Realm database initialized');
  }

  /// Handle database migrations (schema updates)
  static void _onMigration(Migration migration, int oldSchemaVersion) {
    _logger.w('Realm migration from v$oldSchemaVersion');
    // Future migrations here
  }

  // ── Invoice Operations ─────────────────────────────────────────────────

  static InvoiceModel? getInvoice(String id) {
    return instance.find<InvoiceModel>(id);
  }

  static RealmResults<InvoiceModel> getAllInvoices() {
    return instance.all<InvoiceModel>().query('TRUEPREDICATE SORT(createdAtLocal DESC)');
  }

  static RealmResults<InvoiceModel> getUnsyncedInvoices() {
    return instance.all<InvoiceModel>().query('isSynced == false AND status != "draft"');
  }

  static RealmResults<InvoiceModel> getInvoicesByTrip(String tripId) {
    return instance.all<InvoiceModel>().query('tripId == \$0', [tripId]);
  }

  static Future<void> saveInvoice(InvoiceModel invoice) async {
    instance.write(() {
      instance.add(invoice, update: true);
    });
    _logger.d('Invoice saved: ${invoice.id}');
  }

  static Future<void> updateInvoiceStatus(String invoiceId, String status) async {
    final invoice = instance.find<InvoiceModel>(invoiceId);
    if (invoice != null) {
      instance.write(() {
        invoice.status = status;
      });
    }
  }

  static Future<void> markInvoiceSynced(String invoiceId) async {
    final invoice = instance.find<InvoiceModel>(invoiceId);
    if (invoice != null) {
      instance.write(() {
        invoice.isSynced = true;
        invoice.syncedAt = DateTime.now();
      });
    }
  }

  // ── Trip Operations ────────────────────────────────────────────────────

  static RealmResults<TripModel> getAllTrips() {
    return instance.all<TripModel>().query('TRUEPREDICATE SORT(tripDate DESC)');
  }

  static TripModel? getTrip(String id) {
    return instance.find<TripModel>(id);
  }

  static Future<void> saveTrip(TripModel trip) async {
    instance.write(() {
      instance.add(trip, update: true);
    });
  }

  static Future<void> saveTrips(List<TripModel> trips) async {
    instance.write(() {
      for (final trip in trips) {
        instance.add(trip, update: true);
      }
    });
    _logger.d('Saved ${trips.length} trips');
  }

  // ── Media Operations ───────────────────────────────────────────────────

  static RealmResults<MediaModel> getMediaForInvoice(String invoiceId) {
    return instance.all<MediaModel>().query('invoiceId == \$0', [invoiceId]);
  }

  static RealmResults<MediaModel> getPendingUploads() {
    return instance.all<MediaModel>().query('uploadStatus == "pending"');
  }

  static Future<void> saveMedia(MediaModel media) async {
    instance.write(() {
      instance.add(media, update: true);
    });
  }

  static Future<void> updateMediaUploadStatus(
    String mediaId,
    String status, {
    String? googleDriveId,
    String? error,
  }) async {
    final media = instance.find<MediaModel>(mediaId);
    if (media != null) {
      instance.write(() {
        media.uploadStatus = status;
        if (googleDriveId != null) media.googleDriveId = googleDriveId;
        if (error != null) media.uploadError = error;
        if (status == 'uploaded') media.uploadedAt = DateTime.now();
      });
    }
  }

  // ── SyncQueue Operations ───────────────────────────────────────────────

  static RealmResults<SyncQueueModel> getPendingSyncItems() {
    return instance
        .all<SyncQueueModel>()
        .query('status == "pending" AND retryCount < maxRetries');
  }

  static Future<void> addToSyncQueue(SyncQueueModel item) async {
    instance.write(() {
      instance.add(item);
    });
  }

  static Future<void> updateSyncStatus(
    String id,
    String status, {
    String? error,
  }) async {
    final item = instance.find<SyncQueueModel>(id);
    if (item != null) {
      instance.write(() {
        item.status = status;
        item.lastAttemptAt = DateTime.now();
        if (error != null) item.lastError = error;
        if (status == 'completed') item.completedAt = DateTime.now();
        if (status == 'failed') item.retryCount++;
      });
    }
  }

  // ── Serial Number Generation ───────────────────────────────────────────

  /// Generate offline serial number: TRIP-{DATE}-PHOTO-{ID}-{SEQUENCE}
  /// This is globally unique without needing a backend connection
  static String generateSerialNumber(
    String tripId,
    String photographerId,
    int sequence,
  ) {
    // Ensure sequence is zero-padded to 4 digits
    final paddedSequence = sequence.toString().padLeft(4, '0');
    return '$tripId-$photographerId-$paddedSequence';
  }

  /// Get next sequence number for a photographer on a trip
  static int getNextSequence(String tripId, String photographerId) {
    final existingInvoices = instance
        .all<InvoiceModel>()
        .query('tripId == \$0 AND photographerId == \$1', [tripId, photographerId]);

    if (existingInvoices.isEmpty) return 1;

    final maxSequence = existingInvoices.map((i) => i.serialSequence).reduce(
      (a, b) => a > b ? a : b,
    );
    return maxSequence + 1;
  }

  // ── Cleanup ────────────────────────────────────────────────────────────

  static void close() {
    _realm?.close();
    _realm = null;
    _logger.i('Realm database closed');
  }
}
