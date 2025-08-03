import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/dio_provider.dart';
import '../../../features/auth/providers/auth_provider.dart';
import '../data/models/upload_models.dart';

class UploadState {
  final bool isProcessing;
  final String? processedImageUrl;
  final String? error;

  UploadState({
    this.isProcessing = false,
    this.processedImageUrl,
    this.error,
  });

  UploadState copyWith({
    bool? isProcessing,
    String? processedImageUrl,
    String? error,
  }) {
    return UploadState(
      isProcessing: isProcessing ?? this.isProcessing,
      processedImageUrl: processedImageUrl ?? this.processedImageUrl,
      error: error ?? this.error,
    );
  }
}

class UploadNotifier extends StateNotifier<UploadState> {
  final ApiClient _apiClient;
  final Ref _ref;

  UploadNotifier(this._apiClient, this._ref) : super(UploadState());

  Future<void> uploadAndProcess({
    required String userId,
    required String fileName,
    required String fileData,
  }) async {
    state = state.copyWith(isProcessing: true, error: null);

    try {
      // Upload image
      final uploadResponse = await _apiClient.uploadImage(
        UploadRequest(
          userId: userId,
          fileName: fileName,
          fileData: fileData,
        ),
      );

      // Process background removal
      final processResponse = await _apiClient.removeBackground(
        ProcessRequest(
          imageId: uploadResponse.id,
          userId: userId,
        ),
      );

      // Update user credits
      _ref.read(authProvider.notifier).updateCredits(
        processResponse.newCreditBalance,
      );

      state = state.copyWith(
        isProcessing: false,
        processedImageUrl: processResponse.processedUrl,
      );
    } catch (e) {
      state = state.copyWith(
        isProcessing: false,
        error: _getErrorMessage(e),
      );
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  void reset() {
    state = UploadState();
  }

  String _getErrorMessage(dynamic error) {
    final errorString = error.toString();
    
    if (errorString.contains('Insufficient credits')) {
      return "You don't have enough credits to process this image.";
    } else if (errorString.contains('File size exceeds')) {
      return "File size is too large. Please use an image under 10MB.";
    } else if (errorString.contains('File type not supported')) {
      return "File type not supported. Please use JPEG, PNG, or WebP format.";
    } else if (errorString.contains('Failed to upload image to storage')) {
      return "Failed to upload image. Please check your internet connection and try again.";
    } else if (errorString.contains('Image not found')) {
      return "Image not found. Please try uploading again.";
    } else if (errorString.contains('already processed')) {
      return "This image is already being processed or has been processed.";
    }
    
    return "There was an error processing your image. Please try again.";
  }
}

final uploadProvider = StateNotifierProvider<UploadNotifier, UploadState>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return UploadNotifier(apiClient, ref);
});
