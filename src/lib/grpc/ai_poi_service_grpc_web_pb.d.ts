import * as grpcWeb from 'grpc-web';

import * as common_pb from './common_pb'; // proto import: "common.proto"
import * as ai_poi_service_pb from './ai_poi_service_pb'; // proto import: "ai_poi_service.proto"


export class AiPoiServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  healthCheck(
    request: common_pb.HealthCheckRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: common_pb.HealthCheckResponse) => void
  ): grpcWeb.ClientReadableStream<common_pb.HealthCheckResponse>;

  getServiceInfo(
    request: ai_poi_service_pb.GetServiceInfoRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: ai_poi_service_pb.GetServiceInfoResponse) => void
  ): grpcWeb.ClientReadableStream<ai_poi_service_pb.GetServiceInfoResponse>;

  getFeatureFlags(
    request: ai_poi_service_pb.GetFeatureFlagsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: ai_poi_service_pb.GetFeatureFlagsResponse) => void
  ): grpcWeb.ClientReadableStream<ai_poi_service_pb.GetFeatureFlagsResponse>;

}

export class AiPoiServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  healthCheck(
    request: common_pb.HealthCheckRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<common_pb.HealthCheckResponse>;

  getServiceInfo(
    request: ai_poi_service_pb.GetServiceInfoRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ai_poi_service_pb.GetServiceInfoResponse>;

  getFeatureFlags(
    request: ai_poi_service_pb.GetFeatureFlagsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ai_poi_service_pb.GetFeatureFlagsResponse>;

}

