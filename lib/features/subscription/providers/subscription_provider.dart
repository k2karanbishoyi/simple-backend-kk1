import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/dio_provider.dart';
import '../data/models/subscription_models.dart';

class SubscriptionState {
  final List<SubscriptionPlan> plans;
  final bool isLoading;
  final bool isProcessing;
  final String? checkoutUrl;
  final String? error;

  SubscriptionState({
    this.plans = const [],
    this.isLoading = false,
    this.isProcessing = false,
    this.checkoutUrl,
    this.error,
  });

  SubscriptionState copyWith({
    List<SubscriptionPlan>? plans,
    bool? isLoading,
    bool? isProcessing,
    String? checkoutUrl,
    String? error,
  }) {
    return SubscriptionState(
      plans: plans ?? this.plans,
      isLoading: isLoading ?? this.isLoading,
      isProcessing: isProcessing ?? this.isProcessing,
      checkoutUrl: checkoutUrl ?? this.checkoutUrl,
      error: error ?? this.error,
    );
  }
}

class SubscriptionNotifier extends StateNotifier<SubscriptionState> {
  final ApiClient _apiClient;

  SubscriptionNotifier(this._apiClient) : super(SubscriptionState());

  Future<void> loadPlans() async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final response = await _apiClient.getSubscriptionPlans();
      state = state.copyWith(
        plans: response.plans,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Failed to load subscription plans',
      );
    }
  }

  Future<void> createCheckoutSession({
    required String userId,
    required String priceId,
  }) async {
    state = state.copyWith(isProcessing: true, error: null);

    try {
      final response = await _apiClient.createCheckoutSession(
        CheckoutRequest(
          userId: userId,
          priceId: priceId,
          successUrl: 'removehelp://success',
          cancelUrl: 'removehelp://cancel',
        ),
      );

      state = state.copyWith(
        isProcessing: false,
        checkoutUrl: response.checkoutUrl,
      );
    } catch (e) {
      String errorMessage = 'Failed to create checkout session. Please try again.';
      
      if (e.toString().contains('Payment system not configured')) {
        errorMessage = 'Payment system is not configured. Please contact support.';
      }
      
      state = state.copyWith(
        isProcessing: false,
        error: errorMessage,
      );
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  void clearCheckoutUrl() {
    state = state.copyWith(checkoutUrl: null);
  }
}

final subscriptionProvider = StateNotifierProvider<SubscriptionNotifier, SubscriptionState>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return SubscriptionNotifier(apiClient);
});
