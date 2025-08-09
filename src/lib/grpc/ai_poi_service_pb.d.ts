import * as jspb from 'google-protobuf'

import * as common_pb from './common_pb'; // proto import: "common.proto"


export class GetServiceInfoRequest extends jspb.Message {
  getIncludeEndpoints(): boolean;
  setIncludeEndpoints(value: boolean): GetServiceInfoRequest;

  getIncludeVersionInfo(): boolean;
  setIncludeVersionInfo(value: boolean): GetServiceInfoRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetServiceInfoRequest;
  hasRequest(): boolean;
  clearRequest(): GetServiceInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetServiceInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetServiceInfoRequest): GetServiceInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetServiceInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetServiceInfoRequest;
  static deserializeBinaryFromReader(message: GetServiceInfoRequest, reader: jspb.BinaryReader): GetServiceInfoRequest;
}

export namespace GetServiceInfoRequest {
  export type AsObject = {
    includeEndpoints: boolean,
    includeVersionInfo: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class GetServiceInfoResponse extends jspb.Message {
  getServiceInfo(): ServiceInfo | undefined;
  setServiceInfo(value?: ServiceInfo): GetServiceInfoResponse;
  hasServiceInfo(): boolean;
  clearServiceInfo(): GetServiceInfoResponse;

  getEndpointsList(): Array<ServiceEndpoint>;
  setEndpointsList(value: Array<ServiceEndpoint>): GetServiceInfoResponse;
  clearEndpointsList(): GetServiceInfoResponse;
  addEndpoints(value?: ServiceEndpoint, index?: number): ServiceEndpoint;

  getVersionsList(): Array<common_pb.ApiVersion>;
  setVersionsList(value: Array<common_pb.ApiVersion>): GetServiceInfoResponse;
  clearVersionsList(): GetServiceInfoResponse;
  addVersions(value?: common_pb.ApiVersion, index?: number): common_pb.ApiVersion;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetServiceInfoResponse;
  hasResponse(): boolean;
  clearResponse(): GetServiceInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetServiceInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetServiceInfoResponse): GetServiceInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetServiceInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetServiceInfoResponse;
  static deserializeBinaryFromReader(message: GetServiceInfoResponse, reader: jspb.BinaryReader): GetServiceInfoResponse;
}

export namespace GetServiceInfoResponse {
  export type AsObject = {
    serviceInfo?: ServiceInfo.AsObject,
    endpointsList: Array<ServiceEndpoint.AsObject>,
    versionsList: Array<common_pb.ApiVersion.AsObject>,
    response?: BaseResponse.AsObject,
  }
}

export class ServiceInfo extends jspb.Message {
  getName(): string;
  setName(value: string): ServiceInfo;

  getVersion(): string;
  setVersion(value: string): ServiceInfo;

  getDescription(): string;
  setDescription(value: string): ServiceInfo;

  getBuildTime(): string;
  setBuildTime(value: string): ServiceInfo;

  getGitCommit(): string;
  setGitCommit(value: string): ServiceInfo;

  getEnvironment(): string;
  setEnvironment(value: string): ServiceInfo;

  getConfigurationMap(): jspb.Map<string, string>;
  clearConfigurationMap(): ServiceInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceInfo): ServiceInfo.AsObject;
  static serializeBinaryToWriter(message: ServiceInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceInfo;
  static deserializeBinaryFromReader(message: ServiceInfo, reader: jspb.BinaryReader): ServiceInfo;
}

export namespace ServiceInfo {
  export type AsObject = {
    name: string,
    version: string,
    description: string,
    buildTime: string,
    gitCommit: string,
    environment: string,
    configurationMap: Array<[string, string]>,
  }
}

export class ServiceEndpoint extends jspb.Message {
  getName(): string;
  setName(value: string): ServiceEndpoint;

  getPath(): string;
  setPath(value: string): ServiceEndpoint;

  getMethod(): string;
  setMethod(value: string): ServiceEndpoint;

  getDescription(): string;
  setDescription(value: string): ServiceEndpoint;

  getRequiresAuth(): boolean;
  setRequiresAuth(value: boolean): ServiceEndpoint;

  getRequiredPermissionsList(): Array<string>;
  setRequiredPermissionsList(value: Array<string>): ServiceEndpoint;
  clearRequiredPermissionsList(): ServiceEndpoint;
  addRequiredPermissions(value: string, index?: number): ServiceEndpoint;

  getRateLimit(): common_pb.RateLimitInfo | undefined;
  setRateLimit(value?: common_pb.RateLimitInfo): ServiceEndpoint;
  hasRateLimit(): boolean;
  clearRateLimit(): ServiceEndpoint;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceEndpoint.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceEndpoint): ServiceEndpoint.AsObject;
  static serializeBinaryToWriter(message: ServiceEndpoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceEndpoint;
  static deserializeBinaryFromReader(message: ServiceEndpoint, reader: jspb.BinaryReader): ServiceEndpoint;
}

export namespace ServiceEndpoint {
  export type AsObject = {
    name: string,
    path: string,
    method: string,
    description: string,
    requiresAuth: boolean,
    requiredPermissionsList: Array<string>,
    rateLimit?: common_pb.RateLimitInfo.AsObject,
  }
}

export class GetFeatureFlagsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetFeatureFlagsRequest;

  getClientVersion(): string;
  setClientVersion(value: string): GetFeatureFlagsRequest;

  getPlatform(): string;
  setPlatform(value: string): GetFeatureFlagsRequest;

  getUserAttributesMap(): jspb.Map<string, string>;
  clearUserAttributesMap(): GetFeatureFlagsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetFeatureFlagsRequest;
  hasRequest(): boolean;
  clearRequest(): GetFeatureFlagsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeatureFlagsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeatureFlagsRequest): GetFeatureFlagsRequest.AsObject;
  static serializeBinaryToWriter(message: GetFeatureFlagsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeatureFlagsRequest;
  static deserializeBinaryFromReader(message: GetFeatureFlagsRequest, reader: jspb.BinaryReader): GetFeatureFlagsRequest;
}

export namespace GetFeatureFlagsRequest {
  export type AsObject = {
    userId: string,
    clientVersion: string,
    platform: string,
    userAttributesMap: Array<[string, string]>,
    request?: BaseRequest.AsObject,
  }
}

export class GetFeatureFlagsResponse extends jspb.Message {
  getFlagsList(): Array<common_pb.FeatureFlag>;
  setFlagsList(value: Array<common_pb.FeatureFlag>): GetFeatureFlagsResponse;
  clearFlagsList(): GetFeatureFlagsResponse;
  addFlags(value?: common_pb.FeatureFlag, index?: number): common_pb.FeatureFlag;

  getExperimentsMap(): jspb.Map<string, string>;
  clearExperimentsMap(): GetFeatureFlagsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetFeatureFlagsResponse;
  hasResponse(): boolean;
  clearResponse(): GetFeatureFlagsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeatureFlagsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeatureFlagsResponse): GetFeatureFlagsResponse.AsObject;
  static serializeBinaryToWriter(message: GetFeatureFlagsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeatureFlagsResponse;
  static deserializeBinaryFromReader(message: GetFeatureFlagsResponse, reader: jspb.BinaryReader): GetFeatureFlagsResponse;
}

export namespace GetFeatureFlagsResponse {
  export type AsObject = {
    flagsList: Array<common_pb.FeatureFlag.AsObject>,
    experimentsMap: Array<[string, string]>,
    response?: BaseResponse.AsObject,
  }
}

export class ServiceDependencies extends jspb.Message {
  getDatabase(): common_pb.ComponentHealth | undefined;
  setDatabase(value?: common_pb.ComponentHealth): ServiceDependencies;
  hasDatabase(): boolean;
  clearDatabase(): ServiceDependencies;

  getRedisCache(): common_pb.ComponentHealth | undefined;
  setRedisCache(value?: common_pb.ComponentHealth): ServiceDependencies;
  hasRedisCache(): boolean;
  clearRedisCache(): ServiceDependencies;

  getAiService(): common_pb.ComponentHealth | undefined;
  setAiService(value?: common_pb.ComponentHealth): ServiceDependencies;
  hasAiService(): boolean;
  clearAiService(): ServiceDependencies;

  getExternalApis(): common_pb.ComponentHealth | undefined;
  setExternalApis(value?: common_pb.ComponentHealth): ServiceDependencies;
  hasExternalApis(): boolean;
  clearExternalApis(): ServiceDependencies;

  getFileStorage(): common_pb.ComponentHealth | undefined;
  setFileStorage(value?: common_pb.ComponentHealth): ServiceDependencies;
  hasFileStorage(): boolean;
  clearFileStorage(): ServiceDependencies;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceDependencies.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceDependencies): ServiceDependencies.AsObject;
  static serializeBinaryToWriter(message: ServiceDependencies, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceDependencies;
  static deserializeBinaryFromReader(message: ServiceDependencies, reader: jspb.BinaryReader): ServiceDependencies;
}

export namespace ServiceDependencies {
  export type AsObject = {
    database?: common_pb.ComponentHealth.AsObject,
    redisCache?: common_pb.ComponentHealth.AsObject,
    aiService?: common_pb.ComponentHealth.AsObject,
    externalApis?: common_pb.ComponentHealth.AsObject,
    fileStorage?: common_pb.ComponentHealth.AsObject,
  }
}

export class BaseRequest extends jspb.Message {
  getDownstream(): string;
  setDownstream(value: string): BaseRequest;

  getRequestId(): string;
  setRequestId(value: string): BaseRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BaseRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BaseRequest): BaseRequest.AsObject;
  static serializeBinaryToWriter(message: BaseRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BaseRequest;
  static deserializeBinaryFromReader(message: BaseRequest, reader: jspb.BinaryReader): BaseRequest;
}

export namespace BaseRequest {
  export type AsObject = {
    downstream: string,
    requestId: string,
  }
}

export class BaseResponse extends jspb.Message {
  getUpstream(): string;
  setUpstream(value: string): BaseResponse;

  getRequestId(): string;
  setRequestId(value: string): BaseResponse;

  getStatus(): string;
  setStatus(value: string): BaseResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BaseResponse.AsObject;
  static toObject(includeInstance: boolean, msg: BaseResponse): BaseResponse.AsObject;
  static serializeBinaryToWriter(message: BaseResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BaseResponse;
  static deserializeBinaryFromReader(message: BaseResponse, reader: jspb.BinaryReader): BaseResponse;
}

export namespace BaseResponse {
  export type AsObject = {
    upstream: string,
    requestId: string,
    status: string,
  }
}

