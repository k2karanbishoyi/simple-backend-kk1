# Remove.Help - Flutter Mobile App

AI-powered background removal mobile application built with Flutter and Encore.ts backend.

## Features

- 🤖 **AI-Powered Background Removal** - Advanced AI technology for professional results
- 📱 **Native Mobile Experience** - Optimized for both iOS and Android
- 📸 **Camera Integration** - Take photos directly or choose from gallery
- 💳 **Subscription Management** - Stripe integration for premium plans
- 📊 **Image History** - View and download all processed images
- 🎨 **Modern UI** - Clean, intuitive interface with Material Design 3

## Tech Stack

### Frontend (Flutter)
- **Framework**: Flutter 3.10+
- **State Management**: Riverpod
- **Navigation**: GoRouter
- **HTTP Client**: Dio + Retrofit
- **UI Components**: Material Design 3
- **Image Handling**: Image Picker, Cached Network Image
- **Payments**: Flutter Stripe

### Backend (Encore.ts)
- **Framework**: Encore.ts
- **Database**: PostgreSQL
- **Storage**: Object Storage
- **Authentication**: Custom JWT
- **Payments**: Stripe
- **AI Service**: ClipDrop API

## Getting Started

### Prerequisites

- Flutter SDK 3.10 or higher
- Dart SDK 3.0 or higher
- iOS development: Xcode 14+
- Android development: Android Studio with API level 21+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/remove-help-flutter.git
   cd remove-help-flutter
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Generate code**
   ```bash
   flutter packages pub run build_runner build
   ```

4. **Configure API endpoints**
   
   Follow the instructions in the [Configuration](#configuration) section to point the Flutter app and the web app to your Encore backend URL.

5. **Run the app**
   ```bash
   # For iOS
   flutter run -d ios
   
   # For Android
   flutter run -d android
   ```

## Configuration

### Unified Backend and Database

The project is designed with a single backend that serves both the Flutter mobile app and the React web app. This ensures that all data, including user accounts, images, and subscriptions, is stored in a unified database.

To ensure both frontends work correctly and share the same data, they **must** be configured to point to the **same deployed backend URL**.

### Backend Setup

1. **Deploy Encore.ts Backend**
   - Follow the backend setup instructions
   - Configure ClipDrop API key
   - Set up Stripe webhooks
   - Configure database and storage

### Connecting Frontends to Backend

Make sure both the Flutter app and the web frontend point to the same backend instance.

**Flutter App:**
Update `lib/core/config/app_config.dart`:
```dart
// lib/core/config/app_config.dart
static const String baseUrl = 'https://your-backend-url.com';
```

**Web App:**
Update `frontend/.env.development`:
```
# frontend/.env.development
VITE_CLIENT_TARGET=https://your-backend-url.com
```

### Stripe Configuration

1. **Get Stripe Keys**
   - Create a Stripe account
   - Get publishable key from dashboard
   - Configure webhook endpoints

2. **Update Stripe Configuration**
   ```dart
   // lib/core/config/app_config.dart
   static const String stripePublishableKey = 'pk_live_...';
   ```

### Permissions

The app requires the following permissions:

**iOS (Info.plist)**
- Camera access for taking photos
- Photo library access for selecting images

**Android (AndroidManifest.xml)**
- Internet access
- Camera permission
- Storage permissions

## Project Structure

```
lib/
├── core/                   # Core functionality
│   ├── config/            # App configuration
│   ├── network/           # API client and networking
│   ├── router/            # Navigation routing
│   ├── theme/             # App theming
│   └── widgets/           # Shared widgets
├── features/              # Feature modules
│   ├── auth/              # Authentication
│   ├── home/              # Home dashboard
│   ├── upload/            # Image upload and processing
│   ├── history/           # Image history
│   ├── settings/          # App settings
│   └── subscription/      # Subscription management
└── main.dart              # App entry point
```

## Key Features Implementation

### Authentication
- Email/password registration and login
- JWT token management
- Secure storage with SharedPreferences
- Auto-login on app restart

### Image Processing
- Camera and gallery integration
- File validation (size, format)
- Base64 encoding for API transfer
- Real-time processing status
- Error handling and retry logic

### Subscription Management
- Stripe checkout integration
- Plan comparison and selection
- Credit tracking and updates
- Subscription status management

### Image History
- Grid and list view options
- Download functionality
- Status tracking (processing, completed, failed)
- Infinite scroll pagination

## Building for Production

### iOS

1. **Configure signing**
   ```bash
   open ios/Runner.xcworkspace
   ```
   - Set up development team
   - Configure bundle identifier
   - Set up provisioning profiles

2. **Build release**
   ```bash
   flutter build ios --release
   ```

### Android

1. **Configure signing**
   - Create keystore file
   - Update `android/key.properties`
   - Configure `android/app/build.gradle`

2. **Build release**
   ```bash
   flutter build apk --release
   # or
   flutter build appbundle --release
   ```

## Testing

### Unit Tests
```bash
flutter test
```

### Integration Tests
```bash
flutter test integration_test/
```

### Widget Tests
```bash
flutter test test/widget_test.dart
```

## Deployment

### App Store (iOS)
1. Build archive in Xcode
2. Upload to App Store Connect
3. Configure app metadata
4. Submit for review

### Google Play (Android)
1. Build app bundle
2. Upload to Google Play Console
3. Configure store listing
4. Submit for review

## Environment Variables

Create environment-specific configurations:

```dart
// lib/core/config/environments.dart
class Environment {
  static const String development = 'development';
  static const String staging = 'staging';
  static const String production = 'production';
  
  static const String current = String.fromEnvironment(
    'ENVIRONMENT',
    defaultValue: development,
  );
}
```

## Troubleshooting

### Common Issues

1. **Build errors after dependencies update**
   ```bash
   flutter clean
   flutter pub get
   flutter packages pub run build_runner build --delete-conflicting-outputs
   ```

2. **iOS build issues**
   ```bash
   cd ios
   pod install --repo-update
   cd ..
   flutter clean
   flutter build ios
   ```

3. **Android build issues**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   flutter clean
   flutter build android
   ```

### Performance Optimization

1. **Image optimization**
   - Compress images before upload
   - Use appropriate image formats
   - Implement image caching

2. **Network optimization**
   - Implement request caching
   - Use connection pooling
   - Handle offline scenarios

3. **Memory management**
   - Dispose controllers properly
   - Use const constructors
   - Optimize widget rebuilds

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Email: support@removehelp.com
- Documentation: https://docs.removehelp.com

## Roadmap

- [ ] Batch processing
- [ ] Advanced editing tools
- [ ] Social media integration
- [ ] Team collaboration features
- [ ] API access for developers
- [ ] White-label solutions
