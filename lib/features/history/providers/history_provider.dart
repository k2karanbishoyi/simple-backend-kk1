import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/dio_provider.dart';
import '../data/models/history_models.dart';

class HistoryState {
  final List<ImageItem> images;
  final bool isLoading;
  final String? error;

  HistoryState({
    this.images = const [],
    this.isLoading = false,
    this.error,
  });

  HistoryState copyWith({
    List<ImageItem>? images,
    bool? isLoading,
    String? error,
  }) {
    return HistoryState(
      images: images ?? this.images,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class HistoryNotifier extends StateNotifier<HistoryState> {
  final ApiClient _apiClient;

  HistoryNotifier(this._apiClient) : super(HistoryState());

  Future<void> loadHistory(String userId) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final response = await _apiClient.getImageHistory(userId);
      state = state.copyWith(
        images: response.images,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Failed to load image history',
      );
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}

final historyProvider = StateNotifierProvider<HistoryNotifier, HistoryState>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return HistoryNotifier(apiClient);
});
