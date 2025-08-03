import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../config/app_config.dart';
import 'api_client.dart';

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: AppConfig.baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
      },
    ),
  );

  // Add interceptors for logging and error handling
  dio.interceptors.add(
    LogInterceptor(
      requestBody: true,
      responseBody: true,
      error: true,
      logPrint: (object) {
        // Only log in debug mode
        assert(() {
          print('DIO LOG: $object');
          return true;
        }());
      },
    ),
  );

  // Add error interceptor
  dio.interceptors.add(
    InterceptorsWrapper(
      onError: (error, handler) {
        print('DIO ERROR: ${error.message}');
        print('DIO ERROR RESPONSE: ${error.response?.data}');
        
        // Transform DioException to a more readable format
        if (error.response?.data != null) {
          try {
            final data = error.response!.data is String
                ? jsonDecode(error.response!.data)
                : error.response!.data;

            if (data is Map<String, dynamic> && data.containsKey('message')) {
              final newError = DioException(
                requestOptions: error.requestOptions,
                response: error.response,
                type: error.type,
                message: data['message'],
              );
              handler.next(newError);
              return;
            }
          } catch (e) {
            print('DIO ERROR: Could not parse error response body: $e');
          }
        }
        
        handler.next(error);
      },
    ),
  );

  return dio;
});

final apiClientProvider = Provider<ApiClient>((ref) {
  final dio = ref.watch(dioProvider);
  return ApiClient(dio);
});
