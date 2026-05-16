import 'package:realm/realm.dart';
part 'invoice_model.realm.dart';

/// Invoice Realm model for offline-first local storage
/// Serial number format: TRIP-{DATE}-PHOTO-{ID}-{SEQUENCE}
@RealmModel()
class _InvoiceModel {
  @PrimaryKey()
  late String id; // UUID

  late String tripId;
  late String photographerId;
  late String serialNumber; // tripid-photoid-sequence (globally unique)
  late int serialSequence; // counter for this photographer this day

  // Guest info
  late String guestName;
  late String guestContact; // phone or email
  String? guestHotel;
  String? guestRoom;

  // Financial
  late double totalAmount;
  late String currency; // default EGP

  // Timestamps
  late DateTime createdAtLocal; // Device timestamp (offline accuracy)
  DateTime? syncedAt; // When uploaded to server

  // Status: draft, finalized, paid
  late String status;

  // Sync
  late bool isSynced;
  late int retryCount; // number of failed sync attempts

  // Device
  late String deviceId;

  // Media count (cached)
  late int mediaCount;
}
