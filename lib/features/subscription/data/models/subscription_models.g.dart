// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'subscription_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SubscriptionPlan _$SubscriptionPlanFromJson(Map<String, dynamic> json) =>
    SubscriptionPlan(
      id: json['id'] as String,
      name: json['name'] as String,
      price: (json['price'] as num).toDouble(),
      period: json['period'] as String,
      credits: json['credits'] as int,
      features: (json['features'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      stripePriceId: json['stripePriceId'] as String,
      popular: json['popular'] as bool,
    );

Map<String, dynamic> _$SubscriptionPlanToJson(SubscriptionPlan instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'price': instance.price,
      'period': instance.period,
      'credits': instance.credits,
      'features': instance.features,
      'stripePriceId': instance.stripePriceId,
      'popular': instance.popular,
    };

PlansResponse _$PlansResponseFromJson(Map<String, dynamic> json) =>
    PlansResponse(
      plans: (json['plans'] as List<dynamic>)
          .map((e) => SubscriptionPlan.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$PlansResponseToJson(PlansResponse instance) =>
    <String, dynamic>{
      'plans': instance.plans,
    };

CheckoutRequest _$CheckoutRequestFromJson(Map<String, dynamic> json) =>
    CheckoutRequest(
      userId: json['userId'] as String,
      priceId: json['priceId'] as String,
      successUrl: json['successUrl'] as String,
      cancelUrl: json['cancelUrl'] as String,
    );

Map<String, dynamic> _$CheckoutRequestToJson(CheckoutRequest instance) =>
    <String, dynamic>{
      'userId': instance.userId,
      'priceId': instance.priceId,
      'successUrl': instance.successUrl,
      'cancelUrl': instance.cancelUrl,
    };

CheckoutResponse _$CheckoutResponseFromJson(Map<String, dynamic> json) =>
    CheckoutResponse(
      checkoutUrl: json['checkoutUrl'] as String,
    );

Map<String, dynamic> _$CheckoutResponseToJson(CheckoutResponse instance) =>
    <String, dynamic>{
      'checkoutUrl': instance.checkoutUrl,
    };
