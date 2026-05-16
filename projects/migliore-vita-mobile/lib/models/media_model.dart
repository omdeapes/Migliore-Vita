import 'package:realm/realm.dart';
part 'media_model.realm.dart';

/// Media Realm model - photos/videos linked to invoices
@RealmModel()
class _MediaModel {
  @PrimaryKey()
  late String id; // UUID

  late String invoiceId;
  late String filePath; // Local file path
  late int fileSize; // bytes
  late String mediaType; // photo, video

  // Upload status: pending, uploading, uploaded, failed
  late String uploadStatus;
  String? googleDriveId; // Set after successful upload
  String? uploadError; // Error message if failed

  late DateTime createdAt;
  DateTime? uploadedAt;
}
