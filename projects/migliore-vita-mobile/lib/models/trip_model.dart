import 'package:realm/realm.dart';
part 'trip_model.realm.dart';

/// Trip Realm model - synced from server, read-only on device
@RealmModel()
class _TripModel {
  @PrimaryKey()
  late String id; // UUID

  late String tripDate; // ISO date string: "2026-05-11"
  late String safariCenter;
  late String guideId;
  late String guideName;
  late String status; // pending, in_progress, completed

  // Sync metadata
  late DateTime lastSyncedAt;

  // Photographers assigned (comma-separated IDs for simplicity)
  late String assignedPhotographerIds;

  String? notes;
}
