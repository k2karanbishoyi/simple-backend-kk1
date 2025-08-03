import 'package:json_annotation/json_annotation.dart';

part 'upload_models.g.dart';

@JsonSerializable()
class UploadRequest {
  final String userId;
  final String fileName;
  final String fileData;

  UploadRequest({
    required this.userId,
    required this.fileName,
    required this.fileData,
  });

  factory UploadRequest.fromJson(Map<String, dynamic> json) =>
      _$UploadRequestFromJson(json);

  Map<String, dynamic> toJson() => _$UploadRequestToJson(this);
}

@JsonSerializable()
class UploadResponse {
  final String id;
  final String originalUrl;
  final String status;

  UploadResponse({
    required this.id,
    required this.originalUrl,
    required this.status,
  });

  factory UploadResponse.fromJson(Map<String, dynamic> json) =>
      _$UploadResponseFromJson(json);

  Map<String, dynamic> toJson() => _$UploadResponseToJson(this);
}

@JsonSerializable()
class ProcessRequest {
  final String imageId;
  final String userId;

  ProcessRequest({
    required this.imageId,
    required this.userId,
  });

  factory ProcessRequest.fromJson(Map<String, dynamic> json) =>
      _$ProcessRequestFromJson(json);

  Map<String, dynamic> toJson() => _$ProcessRequestToJson(this);
}

@JsonSerializable()
class ProcessResponse {
  final String id;
  final String processedUrl;
  final String status;
  final int newCreditBalance;

  ProcessResponse({
    required this.id,
    required this.processedUrl,
    required this.status,
    required this.newCreditBalance,
  });

  factory ProcessResponse.fromJson(Map<String, dynamic> json) =>
      _$ProcessResponseFromJson(json);

  Map<String, dynamic> toJson() => _$ProcessResponseToJson(this);
}
