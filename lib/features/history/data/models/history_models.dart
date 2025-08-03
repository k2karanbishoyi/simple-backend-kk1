import 'package:json_annotation/json_annotation.dart';

part 'history_models.g.dart';

@JsonSerializable()
class ImageItem {
  final String id;
  final String originalUrl;
  final String? processedUrl;
  final String status;
  final String createdAt;

  ImageItem({
    required this.id,
    required this.originalUrl,
    this.processedUrl,
    required this.status,
    required this.createdAt,
  });

  factory ImageItem.fromJson(Map<String, dynamic> json) =>
      _$ImageItemFromJson(json);

  Map<String, dynamic> toJson() => _$ImageItemToJson(this);
}

@JsonSerializable()
class HistoryResponse {
  final List<ImageItem> images;

  HistoryResponse({
    required this.images,
  });

  factory HistoryResponse.fromJson(Map<String, dynamic> json) =>
      _$HistoryResponseFromJson(json);

  Map<String, dynamic> toJson() => _$HistoryResponseToJson(this);
}
