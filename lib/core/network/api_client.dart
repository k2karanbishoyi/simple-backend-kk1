import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../config/app_config.dart';
import '../../features/auth/data/models/auth_models.dart';
import '../../features/upload/data/models/upload_models.dart';
import '../../features/history/data/models/history_models.dart';
import '../../features/subscription/data/models/subscription_models.dart';

part 'api_client.g.dart';

@RestApi(baseUrl: AppConfig.baseUrl)
abstract class ApiClient {
  factory ApiClient(Dio dio, {String baseUrl}) = _ApiClient;

  // Auth endpoints
  @POST('/auth/register')
  Future<AuthResponse> register(@Body() RegisterRequest request);

  @POST('/auth/login')
  Future<AuthResponse> login(@Body() LoginRequest request);

  // Image endpoints
  @POST('/images/upload')
  Future<UploadResponse> uploadImage(@Body() UploadRequest request);

  @POST('/images/remove-background')
  Future<ProcessResponse> removeBackground(@Body() ProcessRequest request);

  @GET('/images/list/{userId}')
  Future<HistoryResponse> getImageHistory(@Path('userId') String userId);

  // Subscription endpoints
  @GET('/subscriptions/plans')
  Future<PlansResponse> getSubscriptionPlans();

  @POST('/subscriptions/create-checkout')
  Future<CheckoutResponse> createCheckoutSession(@Body() CheckoutRequest request);

  // User endpoints
  @GET('/users/profile/{userId}')
  Future<UserProfile> getUserProfile(@Path('userId') String userId);

  @DELETE('/users/delete-account')
  Future<DeleteAccountResponse> deleteAccount(@Body() DeleteAccountRequest request);
}
