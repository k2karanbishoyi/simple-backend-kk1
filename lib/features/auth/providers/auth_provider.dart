import 'dart:convert';
import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/providers/shared_preferences_provider.dart';
import '../../../core/network/dio_provider.dart';
import '../data/models/auth_models.dart';

class AuthState {
  final User? user;
  final bool isLoading;
  final String? error;

  AuthState({
    this.user,
    this.isLoading = false,
    this.error,
  });

  bool get isAuthenticated => user != null;

  AuthState copyWith({
    User? user,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final SharedPreferences _prefs;
  final ApiClient _apiClient;
  final StreamController<AuthState> _streamController = StreamController<AuthState>.broadcast();

  AuthNotifier(this._prefs, this._apiClient) : super(AuthState()) {
    _loadUserFromStorage();
  }

  Stream<AuthState> get stream => _streamController.stream;

  static const String _userKey = 'user';

  void _loadUserFromStorage() {
    final userJson = _prefs.getString(_userKey);
    if (userJson != null) {
      try {
        final user = User.fromJson(jsonDecode(userJson));
        print('Loaded user from storage: ${user.email}');
        state = state.copyWith(user: user);
        _streamController.add(state);
      } catch (e) {
        print('Error loading user from storage: $e');
        _prefs.remove(_userKey);
      }
    }
  }

  Future<void> _saveUserToStorage(User user) async {
    await _prefs.setString(_userKey, jsonEncode(user.toJson()));
    print('Saved user to storage: ${user.email}');
  }

  Future<void> _removeUserFromStorage() async {
    await _prefs.remove(_userKey);
    print('Removed user from storage');
  }

  @override
  set state(AuthState value) {
    super.state = value;
    _streamController.add(value);
  }

  Future<void> register(String email, String password) async {
    print('Starting registration for: $email');
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final response = await _apiClient.register(
        RegisterRequest(email: email, password: password),
      );
      
      print('Registration response: ${response.id}, ${response.email}, ${response.credits}');
      
      final user = User(
        id: response.id,
        email: response.email,
        credits: response.credits,
        token: response.token,
      );
      
      await _saveUserToStorage(user);
      state = state.copyWith(user: user, isLoading: false);
      print('Registration successful, user authenticated');
    } catch (e) {
      print('Registration error: $e');
      state = state.copyWith(
        isLoading: false,
        error: _getErrorMessage(e),
      );
      rethrow;
    }
  }

  Future<void> login(String email, String password) async {
    print('Starting login for: $email');
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final response = await _apiClient.login(
        LoginRequest(email: email, password: password),
      );
      
      print('Login response: ${response.id}, ${response.email}, ${response.credits}');
      
      final user = User(
        id: response.id,
        email: response.email,
        credits: response.credits,
        token: response.token,
      );
      
      await _saveUserToStorage(user);
      state = state.copyWith(user: user, isLoading: false);
      print('Login successful, user authenticated');
    } catch (e) {
      print('Login error: $e');
      state = state.copyWith(
        isLoading: false,
        error: _getErrorMessage(e),
      );
      rethrow;
    }
  }

  Future<void> logout() async {
    print('Logging out user');
    await _removeUserFromStorage();
    state = AuthState();
  }

  void updateCredits(int credits) {
    if (state.user != null) {
      final updatedUser = state.user!.copyWith(credits: credits);
      _saveUserToStorage(updatedUser);
      state = state.copyWith(user: updatedUser);
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  String _getErrorMessage(dynamic error) {
    if (error is DioException) {
      // Handle Dio-specific errors
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          return 'Request timeout. Please check your connection and try again.';
        case DioExceptionType.badResponse:
          // The interceptor should have already extracted the message from the backend.
          if (error.message != null && error.message!.isNotEmpty) {
            return error.message!;
          }
          return 'An unknown error occurred with the server response.';
        case DioExceptionType.cancel:
          return 'Request was canceled.';
        case DioExceptionType.connectionError:
          return 'Network error. Please check your internet connection.';
        case DioExceptionType.unknown:
          if (error.message?.toLowerCase().contains('socketexception') ?? false) {
            return 'Network error. Please check your internet connection.';
          }
          break;
        case DioExceptionType.badCertificate:
          return 'Bad certificate. Please contact support.';
      }
    }
    
    // Fallback for non-Dio errors or unhandled Dio errors
    return 'An error occurred. Please try again.';
  }

  @override
  void dispose() {
    _streamController.close();
    super.dispose();
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  final apiClient = ref.watch(apiClientProvider);
  return AuthNotifier(prefs, apiClient);
});
