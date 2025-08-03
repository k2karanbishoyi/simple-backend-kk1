class AppConfig {
  // Updated with your actual Encore.ts backend URL
  static const String baseUrl = 'https://hello-backend-d26rr8482vjle7u4l04g.lp.dev';
  
  // TODO: Replace with your actual Stripe publishable key
  static const String stripePublishableKey = 'pk_test_your_stripe_publishable_key';
  
  // API Endpoints
  static const String authEndpoint = '/auth';
  static const String imagesEndpoint = '/images';
  static const String subscriptionsEndpoint = '/subscriptions';
  static const String usersEndpoint = '/users';
  
  // App Constants
  static const int maxImageSizeMB = 10;
  static const List<String> supportedImageFormats = ['jpg', 'jpeg', 'png', 'webp'];
  static const int freeCredits = 5;
  
  // Subscription Plans
  static const String monthlyPriceId = 'price_monthly_demo';
  static const String annualPriceId = 'price_annual_demo';
  
  // Development mode flag
  static const bool isDevelopment = true;
  
  // Demo mode URLs (for testing without real backend)
  static const String demoBaseUrl = 'https://demo-api.removehelp.com';
}
