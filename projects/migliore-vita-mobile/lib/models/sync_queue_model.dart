import 'package:realm/realm.dart';
part 'sync_queue_model.realm.dart';

/// SyncQueue - tracks all pending sync operations
/// Ensures no data is lost even if sync fails
@RealmModel()
class _SyncQueueModel {
  @PrimaryKey()
  late String id; // UUID

  // What to sync
  late String entityType; // invoice, media
  late String entityId; // UUID of entity
  late String action; // create, update, delete

  // Serialized payload (JSON string)
  late String payload;

  // Sync status: pending, in_progress, completed, failed
  late String status;

  // Retry management
  late int retryCount;
  late int maxRetries; // default 3
  DateTime? lastAttemptAt;
  String? lastError;

  late DateTime createdAt;
  DateTime? completedAt;
}
