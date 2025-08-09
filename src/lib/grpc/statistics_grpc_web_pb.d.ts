import * as grpcWeb from 'grpc-web';

import * as statistics_pb from './statistics_pb'; // proto import: "statistics.proto"


export class StatisticsServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getMainPageStatistics(
    request: statistics_pb.GetMainPageStatisticsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: statistics_pb.GetMainPageStatisticsResponse) => void
  ): grpcWeb.ClientReadableStream<statistics_pb.GetMainPageStatisticsResponse>;

  streamMainPageStatistics(
    request: statistics_pb.StreamMainPageStatisticsRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<statistics_pb.StatisticsEvent>;

  getDetailedPOIStatistics(
    request: statistics_pb.GetDetailedPOIStatisticsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: statistics_pb.GetDetailedPOIStatisticsResponse) => void
  ): grpcWeb.ClientReadableStream<statistics_pb.GetDetailedPOIStatisticsResponse>;

  getLandingPageStatistics(
    request: statistics_pb.GetLandingPageStatisticsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: statistics_pb.GetLandingPageStatisticsResponse) => void
  ): grpcWeb.ClientReadableStream<statistics_pb.GetLandingPageStatisticsResponse>;

  getUserActivityAnalytics(
    request: statistics_pb.GetUserActivityAnalyticsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: statistics_pb.GetUserActivityAnalyticsResponse) => void
  ): grpcWeb.ClientReadableStream<statistics_pb.GetUserActivityAnalyticsResponse>;

  getSystemAnalytics(
    request: statistics_pb.GetSystemAnalyticsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: statistics_pb.GetSystemAnalyticsResponse) => void
  ): grpcWeb.ClientReadableStream<statistics_pb.GetSystemAnalyticsResponse>;

}

export class StatisticsServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getMainPageStatistics(
    request: statistics_pb.GetMainPageStatisticsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<statistics_pb.GetMainPageStatisticsResponse>;

  streamMainPageStatistics(
    request: statistics_pb.StreamMainPageStatisticsRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<statistics_pb.StatisticsEvent>;

  getDetailedPOIStatistics(
    request: statistics_pb.GetDetailedPOIStatisticsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<statistics_pb.GetDetailedPOIStatisticsResponse>;

  getLandingPageStatistics(
    request: statistics_pb.GetLandingPageStatisticsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<statistics_pb.GetLandingPageStatisticsResponse>;

  getUserActivityAnalytics(
    request: statistics_pb.GetUserActivityAnalyticsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<statistics_pb.GetUserActivityAnalyticsResponse>;

  getSystemAnalytics(
    request: statistics_pb.GetSystemAnalyticsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<statistics_pb.GetSystemAnalyticsResponse>;

}

