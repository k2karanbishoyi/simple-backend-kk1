import 'package:json_annotation/json_annotation.dart';

part 'auth_models.g.dart';

@JsonSerializable()
class RegisterRequest {
  final String email;
  final String password;

  RegisterRequest({
    required this.email,
    required this.password,
  });

  factory RegisterRequest.fromJson(Map<String, dynamic> json) =>
      _$RegisterRequestFromJson(json);

  Map<String, dynamic> toJson() => _$RegisterRequestToJson(this);
}

@JsonSerializable()
class LoginRequest {
  final String email;
  final String password;

  LoginRequest({
    required this.email,
    required this.password,
  });

  factory LoginRequest.fromJson(Map<String, dynamic> json) =>
      _$LoginRequestFromJson(json);

  Map<String, dynamic> toJson() => _$LoginRequestToJson(this);
}

@JsonSerializable()
class AuthResponse {
  final String id;
  final String email;
  final int credits;
  final String token;

  AuthResponse({
    required this.id,
    required this.email,
    required this.credits,
    required this.token,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) =>
      _$AuthResponseFromJson(json);

  Map<String, dynamic> toJson() => _$AuthResponseToJson(this);
}

@JsonSerializable()
class User {
  final String id;
  final String email;
  final int credits;
  final String token;

  User({
    required this.id,
    required this.email,
    required this.credits,
    required this.token,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

  Map<String, dynamic> toJson() => _$UserToJson(this);

  User copyWith({
    String? id,
    String? email,
    int? credits,
    String? token,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      credits: credits ?? this.credits,
      token: token ?? this.token,
    );
  }
}

@JsonSerializable()
class UserProfile {
  final String id;
  final String email;
  final int credits;
  final String subscriptionStatus;
  final String createdAt;

  UserProfile({
    required this.id,
    required this.email,
    required this.credits,
    required this.subscriptionStatus,
    required this.createdAt,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) =>
      _$UserProfileFromJson(json);

  Map<String, dynamic> toJson() => _$UserProfileToJson(this);
}

@JsonSerializable()
class DeleteAccountRequest {
  final String userId;
  final String password;

  DeleteAccountRequest({
    required this.userId,
    required this.password,
  });

  factory DeleteAccountRequest.fromJson(Map<String, dynamic> json) =>
      _$DeleteAccountRequestFromJson(json);

  Map<String, dynamic> toJson() => _$DeleteAccountRequestToJson(this);
}

@JsonSerializable()
class DeleteAccountResponse {
  final bool success;
  final String message;

  DeleteAccountResponse({
    required this.success,
    required this.message,
  });

  factory DeleteAccountResponse.fromJson(Map<String, dynamic> json) =>
      _$DeleteAccountResponseFromJson(json);

  Map<String, dynamic> toJson() => _$DeleteAccountResponseToJson(this);
}
