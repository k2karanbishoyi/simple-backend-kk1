import 'package:json_annotation/json_annotation.dart';

part 'subscription_models.g.dart';

@JsonSerializable()
class SubscriptionPlan {
  final String id;
  final String name;
  final double price;
  final String period;
  final int credits;
  final List<String> features;
  final String stripePriceId;
  final bool popular;

  SubscriptionPlan({
    required this.id,
    required this.name,
    required this.price,
    required this.period,
    required this.credits,
    required this.features,
    required this.stripePriceId,
    required this.popular,
  });

  factory SubscriptionPlan.fromJson(Map<String, dynamic> json) =>
      _$SubscriptionPlanFromJson(json);

  Map<String, dynamic> toJson() => _$SubscriptionPlanToJson(this);
}

@JsonSerializable()
class PlansResponse {
  final List<SubscriptionPlan> plans;

  PlansResponse({
    required this.plans,
  });

  factory PlansResponse.fromJson(Map<String, dynamic> json) =>
      _$PlansResponseFromJson(json);

  Map<String, dynamic> toJson() => _$PlansResponseToJson(this);
}

@JsonSerializable()
class CheckoutRequest {
  final String userId;
  final String priceId;
  final String successUrl;
  final String cancelUrl;

  CheckoutRequest({
    required this.userId,
    required this.priceId,
    required this.successUrl,
    required this.cancelUrl,
  });

  factory CheckoutRequest.fromJson(Map<String, dynamic> json) =>
      _$CheckoutRequestFromJson(json);

  Map<String, dynamic> toJson() => _$CheckoutRequestToJson(this);
}

@JsonSerializable()
class CheckoutResponse {
  final String checkoutUrl;

  CheckoutResponse({
    required this.checkoutUrl,
  });

  factory CheckoutResponse.fromJson(Map<String, dynamic> json) =>
      _$CheckoutResponseFromJson(json);

  Map<String, dynamic> toJson() => _$CheckoutResponseToJson(this);
}
