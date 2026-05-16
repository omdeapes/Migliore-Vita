import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';
import 'package:logger/logger.dart';

import '../../models/media_model.dart';
import '../../services/realm_service.dart';
import '../../services/sync_service.dart';
import '../../services/api_service.dart';

class MediaCaptureScreen extends StatefulWidget {
  final String invoiceId;

  const MediaCaptureScreen({super.key, required this.invoiceId});

  @override
  State<MediaCaptureScreen> createState() => _MediaCaptureScreenState();
}

class _MediaCaptureScreenState extends State<MediaCaptureScreen> {
  final _picker = ImagePicker();
  final _uuid = const Uuid();
  final _logger = Logger();

  List<MediaModel> _mediaItems = [];
  bool _isCapturing = false;

  @override
  void initState() {
    super.initState();
    _loadMedia();
  }

  void _loadMedia() {
    setState(() {
      _mediaItems = RealmService.getMediaForInvoice(widget.invoiceId).toList();
    });
  }

  Future<void> _capturePhoto() async {
    setState(() => _isCapturing = true);
    try {
      final image = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 85,
      );
      if (image != null) {
        await _saveMedia(image.path, 'photo');
      }
    } catch (e) {
      _logger.e('Camera error: $e');
      _showError('Could not access camera');
    } finally {
      setState(() => _isCapturing = false);
    }
  }

  Future<void> _pickFromGallery() async {
    setState(() => _isCapturing = true);
    try {
      final images = await _picker.pickMultiImage(imageQuality: 85);
      for (final image in images) {
        await _saveMedia(image.path, 'photo');
      }
    } catch (e) {
      _logger.e('Gallery error: $e');
      _showError('Could not access gallery');
    } finally {
      setState(() => _isCapturing = false);
    }
  }

  Future<void> _captureVideo() async {
    setState(() => _isCapturing = true);
    try {
      final video = await _picker.pickVideo(source: ImageSource.camera);
      if (video != null) {
        await _saveMedia(video.path, 'video');
      }
    } catch (e) {
      _logger.e('Video error: $e');
      _showError('Could not capture video');
    } finally {
      setState(() => _isCapturing = false);
    }
  }

  Future<void> _saveMedia(String filePath, String mediaType) async {
    final media = MediaModel(
      _uuid.v4(),
      invoiceId: widget.invoiceId,
      filePath: filePath,
      fileSize: 0, // Will be updated
      mediaType: mediaType,
      uploadStatus: 'pending',
      createdAt: DateTime.now(),
    );

    await RealmService.saveMedia(media);
    _loadMedia();

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${mediaType == 'photo' ? '📷' : '🎬'} Added to invoice'),
          duration: const Duration(seconds: 2),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  void _showError(String message) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message), backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Add Media (${_mediaItems.length} files)'),
      ),
      body: Column(
        children: [
          // Action buttons
          Container(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: _ActionButton(
                    icon: Icons.camera_alt,
                    label: 'Photo',
                    onPressed: _isCapturing ? null : _capturePhoto,
                    color: Colors.blue,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _ActionButton(
                    icon: Icons.video_camera_back,
                    label: 'Video',
                    onPressed: _isCapturing ? null : _captureVideo,
                    color: Colors.purple,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _ActionButton(
                    icon: Icons.photo_library,
                    label: 'Gallery',
                    onPressed: _isCapturing ? null : _pickFromGallery,
                    color: Colors.green,
                  ),
                ),
              ],
            ),
          ),

          // Media grid
          Expanded(
            child: _mediaItems.isEmpty
                ? const Center(
                    child: Text(
                      'No media yet\nCapture photos or videos above',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey),
                    ),
                  )
                : GridView.builder(
                    padding: const EdgeInsets.all(8),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      crossAxisSpacing: 4,
                      mainAxisSpacing: 4,
                    ),
                    itemCount: _mediaItems.length,
                    itemBuilder: (context, index) {
                      final media = _mediaItems[index];
                      return _MediaThumbnail(media: media);
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onPressed;
  final Color color;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.onPressed,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, size: 20),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 12),
      ),
    );
  }
}

class _MediaThumbnail extends StatelessWidget {
  final MediaModel media;

  const _MediaThumbnail({required this.media});

  @override
  Widget build(BuildContext context) {
    final isUploaded = media.uploadStatus == 'uploaded';

    return Stack(
      children: [
        Container(
          decoration: BoxDecoration(
            color: Colors.grey.shade200,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Center(
            child: Icon(
              media.mediaType == 'photo' ? Icons.image : Icons.videocam,
              size: 32,
              color: Colors.grey.shade500,
            ),
          ),
        ),
        Positioned(
          bottom: 4,
          right: 4,
          child: Icon(
            isUploaded ? Icons.cloud_done : Icons.cloud_upload_outlined,
            size: 16,
            color: isUploaded ? Colors.green : Colors.orange,
          ),
        ),
      ],
    );
  }
}
