import * as grpcWeb from 'grpc-web';

import * as recents_pb from './recents_pb'; // proto import: "recents.proto"


export class RecentsServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getRecentInteractions(
    request: recents_pb.GetRecentInteractionsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: recents_pb.GetRecentInteractionsResponse) => void
  ): grpcWeb.ClientReadableStream<recents_pb.GetRecentInteractionsResponse>;

  getCityInteractions(
    request: recents_pb.GetCityInteractionsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: recents_pb.GetCityInteractionsResponse) => void
  ): grpcWeb.ClientReadableStream<recents_pb.GetCityInteractionsResponse>;

  recordInteraction(
    request: recents_pb.RecordInteractionRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: recents_pb.RecordInteractionResponse) => void
  ): grpcWeb.ClientReadableStream<recents_pb.RecordInteractionResponse>;

  getInteractionHistory(
    request: recents_pb.GetInteractionHistoryRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: recents_pb.GetInteractionHistoryResponse) => void
  ): grpcWeb.ClientReadableStream<recents_pb.GetInteractionHistoryResponse>;

  getFrequentPlaces(
    request: recents_pb.GetFrequentPlacesRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: recents_pb.GetFrequentPlacesResponse) => void
  ): grpcWeb.ClientReadableStream<recents_pb.GetFrequentPlacesResponse>;

}

export class RecentsServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getRecentInteractions(
    request: recents_pb.GetRecentInteractionsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<recents_pb.GetRecentInteractionsResponse>;

  getCityInteractions(
    request: recents_pb.GetCityInteractionsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<recents_pb.GetCityInteractionsResponse>;

  recordInteraction(
    request: recents_pb.RecordInteractionRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<recents_pb.RecordInteractionResponse>;

  getInteractionHistory(
    request: recents_pb.GetInteractionHistoryRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<recents_pb.GetInteractionHistoryResponse>;

  getFrequentPlaces(
    request: recents_pb.GetFrequentPlacesRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<recents_pb.GetFrequentPlacesResponse>;

}

