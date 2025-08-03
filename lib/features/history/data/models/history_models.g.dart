// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'history_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ImageItem _$ImageItemFromJson(Map<String, dynamic> json) => ImageItem(
      id: json['id'] as String,
      originalUrl: json['originalUrl'] as String,
      processedUrl: json['processedUrl'] as String?,
      status: json['status'] as String,
      createdAt: json['createdAt'] as String,
    );

Map<String, dynamic> _$ImageItemToJson(ImageItem instance) => <String, dynamic>{
      'id': instance.id,
      'originalUrl': instance.originalUrl,
      'processedUrl': instance.processedUrl,
      'status': instance.status,
      'createdAt': instance.createdAt,
    };

HistoryResponse _$HistoryResponseFromJson(Map<String, dynamic> json) =>
    HistoryResponse(
      images: (json['images'] as List<dynamic>)
          .map((e) => ImageItem.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$HistoryResponseToJson(HistoryResponse instance) =>
    <String, dynamic>{
      'images': instance.images,
    };
