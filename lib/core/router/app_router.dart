import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/pages/auth_page.dart';
import '../../features/auth/presentation/pages/onboarding_page.dart';
import '../../features/home/presentation/pages/home_page.dart';
import '../../features/upload/presentation/pages/upload_page.dart';
import '../../features/history/presentation/pages/history_page.dart';
import '../../features/settings/presentation/pages/settings_page.dart';
import '../../features/subscription/presentation/pages/subscription_page.dart';
import '../../features/auth/providers/auth_provider.dart';
import '../widgets/main_navigation.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final authNotifier = ref.read(authProvider.notifier);
  
  return GoRouter(
    initialLocation: '/onboarding',
    redirect: (context, state) {
      final authState = ref.read(authProvider);
      final isAuthenticated = authState.isAuthenticated;
      final currentLocation = state.location;
      
      print('Router redirect - isAuthenticated: $isAuthenticated, location: $currentLocation');
      
      // If user is authenticated and trying to access onboarding or auth pages, redirect to home
      if (isAuthenticated && (currentLocation == '/onboarding' || currentLocation == '/auth')) {
        print('Redirecting authenticated user to /home');
        return '/home';
      }
      
      // If user is not authenticated and trying to access protected routes, redirect to onboarding
      if (!isAuthenticated && currentLocation.startsWith('/home')) {
        print('Redirecting unauthenticated user to /onboarding');
        return '/onboarding';
      }
      
      if (!isAuthenticated && currentLocation.startsWith('/upload')) {
        return '/onboarding';
      }
      
      if (!isAuthenticated && currentLocation.startsWith('/history')) {
        return '/onboarding';
      }
      
      if (!isAuthenticated && currentLocation.startsWith('/settings')) {
        return '/onboarding';
      }
      
      if (!isAuthenticated && currentLocation.startsWith('/subscription')) {
        return '/onboarding';
      }
      
      return null;
    },
    refreshListenable: GoRouterRefreshStream(authNotifier.stream),
    routes: [
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingPage(),
      ),
      GoRoute(
        path: '/auth',
        builder: (context, state) => const AuthPage(),
      ),
      ShellRoute(
        builder: (context, state, child) => MainNavigation(child: child),
        routes: [
          GoRoute(
            path: '/home',
            builder: (context, state) => const HomePage(),
          ),
          GoRoute(
            path: '/upload',
            builder: (context, state) => const UploadPage(),
          ),
          GoRoute(
            path: '/history',
            builder: (context, state) => const HistoryPage(),
          ),
          GoRoute(
            path: '/settings',
            builder: (context, state) => const SettingsPage(),
          ),
        ],
      ),
      GoRoute(
        path: '/subscription',
        builder: (context, state) => const SubscriptionPage(),
      ),
    ],
  );
});

class GoRouterRefreshStream extends ChangeNotifier {
  GoRouterRefreshStream(Stream<AuthState> stream) {
    notifyListeners();
    _subscription = stream.asBroadcastStream().listen(
      (AuthState _) => notifyListeners(),
    );
  }

  late final StreamSubscription<AuthState> _subscription;

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}
