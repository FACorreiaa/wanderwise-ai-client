import * as grpcWeb from 'grpc-web';

import * as chat_pb from './chat_pb'; // proto import: "chat.proto"


export class ChatServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  startChatStream(
    request: chat_pb.StartChatRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<chat_pb.ChatEvent>;

  continueChatStream(
    request: chat_pb.ContinueChatRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<chat_pb.ChatEvent>;

  freeChatStream(
    request: chat_pb.FreeChatRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<chat_pb.ChatEvent>;

  getChatSessions(
    request: chat_pb.GetChatSessionsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: chat_pb.GetChatSessionsResponse) => void
  ): grpcWeb.ClientReadableStream<chat_pb.GetChatSessionsResponse>;

  saveItinerary(
    request: chat_pb.SaveItineraryRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: chat_pb.SaveItineraryResponse) => void
  ): grpcWeb.ClientReadableStream<chat_pb.SaveItineraryResponse>;

  getSavedItineraries(
    request: chat_pb.GetSavedItinerariesRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: chat_pb.GetSavedItinerariesResponse) => void
  ): grpcWeb.ClientReadableStream<chat_pb.GetSavedItinerariesResponse>;

  removeItinerary(
    request: chat_pb.RemoveItineraryRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: chat_pb.RemoveItineraryResponse) => void
  ): grpcWeb.ClientReadableStream<chat_pb.RemoveItineraryResponse>;

  getPOIDetails(
    request: chat_pb.GetPOIDetailsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: chat_pb.GetPOIDetailsResponse) => void
  ): grpcWeb.ClientReadableStream<chat_pb.GetPOIDetailsResponse>;

}

export class ChatServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  startChatStream(
    request: chat_pb.StartChatRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<chat_pb.ChatEvent>;

  continueChatStream(
    request: chat_pb.ContinueChatRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<chat_pb.ChatEvent>;

  freeChatStream(
    request: chat_pb.FreeChatRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<chat_pb.ChatEvent>;

  getChatSessions(
    request: chat_pb.GetChatSessionsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<chat_pb.GetChatSessionsResponse>;

  saveItinerary(
    request: chat_pb.SaveItineraryRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<chat_pb.SaveItineraryResponse>;

  getSavedItineraries(
    request: chat_pb.GetSavedItinerariesRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<chat_pb.GetSavedItinerariesResponse>;

  removeItinerary(
    request: chat_pb.RemoveItineraryRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<chat_pb.RemoveItineraryResponse>;

  getPOIDetails(
    request: chat_pb.GetPOIDetailsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<chat_pb.GetPOIDetailsResponse>;

}

