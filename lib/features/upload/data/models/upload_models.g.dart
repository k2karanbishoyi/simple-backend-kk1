// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'upload_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UploadRequest _$UploadRequestFromJson(Map<String, dynamic> json) =>
    UploadRequest(
      userId: json['userId'] as String,
      fileName: json['fileName'] as String,
      fileData: json['fileData'] as String,
    );

Map<String, dynamic> _$UploadRequestToJson(UploadRequest instance) =>
    <String, dynamic>{
      'userId': instance.userId,
      'fileName': instance.fileName,
      'fileData': instance.fileData,
    };

UploadResponse _$UploadResponseFromJson(Map<String, dynamic> json) =>
    UploadResponse(
      id: json['id'] as String,
      originalUrl: json['originalUrl'] as String,
      status: json['status'] as String,
    );

Map<String, dynamic> _$UploadResponseToJson(UploadResponse instance) =>
    <String, dynamic>{
      'id': instance.id,
      'originalUrl': instance.originalUrl,
      'status': instance.status,
    };

ProcessRequest _$ProcessRequestFromJson(Map<String, dynamic> json) =>
    ProcessRequest(
      imageId: json['imageId'] as String,
      userId: json['userId'] as String,
    );

Map<String, dynamic> _$ProcessRequestToJson(ProcessRequest instance) =>
    <String, dynamic>{
      'imageId': instance.imageId,
      'userId': instance.userId,
    };

ProcessResponse _$ProcessResponseFromJson(Map<String, dynamic> json) =>
    ProcessResponse(
      id: json['id'] as String,
      processedUrl: json['processedUrl'] as String,
      status: json['status'] as String,
      newCreditBalance: json['newCreditBalance'] as int,
    );

Map<String, dynamic> _$ProcessResponseToJson(ProcessResponse instance) =>
    <String, dynamic>{
      'id': instance.id,
      'processedUrl': instance.processedUrl,
      'status': instance.status,
      'newCreditBalance': instance.newCreditBalance,
    };
