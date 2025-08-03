import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../core/config/app_config.dart';
import '../../../auth/providers/auth_provider.dart';
import '../providers/upload_provider.dart';
import '../widgets/upload_zone.dart';
import '../widgets/processing_dialog.dart';

class UploadPage extends ConsumerStatefulWidget {
  const UploadPage({super.key});

  @override
  ConsumerState<UploadPage> createState() => _UploadPageState();
}

class _UploadPageState extends ConsumerState<UploadPage> {
  final ImagePicker _picker = ImagePicker();

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final uploadState = ref.watch(uploadProvider);
    final user = authState.user!;

    ref.listen<UploadState>(uploadProvider, (previous, next) {
      if (next.isProcessing && previous?.isProcessing != true) {
        _showProcessingDialog();
      }
      
      if (next.error != null) {
        Navigator.of(context).pop(); // Close processing dialog
        _showErrorSnackBar(next.error!);
        ref.read(uploadProvider.notifier).clearError();
      }
      
      if (next.processedImageUrl != null && previous?.processedImageUrl == null) {
        Navigator.of(context).pop(); // Close processing dialog
        _showSuccessDialog(next.processedImageUrl!);
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Upload Image'),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppTheme.primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.stars,
                  size: 16,
                  color: AppTheme.primaryColor,
                ),
                const SizedBox(width: 4),
                Text(
                  '${user.credits} credits',
                  style: const TextStyle(
                    color: AppTheme.primaryColor,
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Upload zone
            UploadZone(
              onImageSelected: _handleImageSelected,
              isProcessing: uploadState.isProcessing,
            ),
            
            const SizedBox(height: 24),
            
            // No credits warning
            if (user.credits <= 0)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.warningColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: AppTheme.warningColor.withOpacity(0.3),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.warning_outlined,
                          color: AppTheme.warningColor,
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          'No credits remaining',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'You\'ve used all your credits. Upgrade to continue processing images.',
                      style: TextStyle(
                        color: AppTheme.secondaryColor,
                      ),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: () => context.push('/subscription'),
                      child: const Text('Upgrade Plan'),
                    ),
                  ],
                ),
              ),
            
            const SizedBox(height: 24),
            
            // Instructions
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Colors.blue.withOpacity(0.3),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.info_outline,
                        color: Colors.blue,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'Getting Started',
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    '• Upload JPEG, PNG, or WebP images up to ${AppConfig.maxImageSizeMB}MB\n'
                    '• Processing takes less than 5 seconds\n'
                    '• Each image costs 1 credit\n'
                    '• Download your processed images from the History tab',
                    style: TextStyle(
                      color: AppTheme.secondaryColor,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Demo notice
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.successColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppTheme.successColor.withOpacity(0.3),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.check_circle_outline,
                        color: AppTheme.successColor,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'Demo Mode',
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'This is a demo version. If ClipDrop API is not configured, the system will use the original image for demonstration purposes.',
                    style: TextStyle(
                      color: AppTheme.secondaryColor,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _handleImageSelected(File imageFile) async {
    final user = ref.read(authProvider).user!;
    
    if (user.credits <= 0) {
      _showErrorSnackBar('No credits remaining. Please upgrade your plan.');
      return;
    }

    // Validate file size
    final fileSizeInMB = imageFile.lengthSync() / (1024 * 1024);
    if (fileSizeInMB > AppConfig.maxImageSizeMB) {
      _showErrorSnackBar('File size must be less than ${AppConfig.maxImageSizeMB}MB');
      return;
    }

    // Validate file format
    final fileName = imageFile.path.split('/').last.toLowerCase();
    final extension = fileName.split('.').last;
    if (!AppConfig.supportedImageFormats.contains(extension)) {
      _showErrorSnackBar('Please select a JPEG, PNG, or WebP image file');
      return;
    }

    try {
      // Convert to base64
      final bytes = await imageFile.readAsBytes();
      final base64String = base64Encode(bytes);

      // Upload and process
      await ref.read(uploadProvider.notifier).uploadAndProcess(
        userId: user.id,
        fileName: fileName,
        fileData: base64String,
      );
    } catch (e) {
      _showErrorSnackBar('Failed to process image: $e');
    }
  }

  void _showProcessingDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const ProcessingDialog(),
    );
  }

  void _showSuccessDialog(String processedImageUrl) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Success!'),
        content: const Text('Your image has been processed successfully.'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              context.go('/history');
            },
            child: const Text('View in History'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              ref.read(uploadProvider.notifier).reset();
            },
            child: const Text('Process Another'),
          ),
        ],
      ),
    );
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppTheme.errorColor,
      ),
    );
  }

  Future<void> _pickImageFromCamera() async {
    final status = await Permission.camera.request();
    if (status.isGranted) {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.camera,
        maxWidth: 1920,
        maxHeight: 1920,
        imageQuality: 85,
      );
      
      if (image != null) {
        await _handleImageSelected(File(image.path));
      }
    }
  }

  Future<void> _pickImageFromGallery() async {
    final XFile? image = await _picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 1920,
      maxHeight: 1920,
      imageQuality: 85,
    );
    
    if (image != null) {
      await _handleImageSelected(File(image.path));
    }
  }
}
