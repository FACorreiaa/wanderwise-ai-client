import * as grpcWeb from 'grpc-web';

import * as interests_pb from './interests_pb'; // proto import: "interests.proto"


export class InterestsServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getAllInterests(
    request: interests_pb.GetAllInterestsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: interests_pb.GetAllInterestsResponse) => void
  ): grpcWeb.ClientReadableStream<interests_pb.GetAllInterestsResponse>;

  createInterest(
    request: interests_pb.CreateInterestRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: interests_pb.CreateInterestResponse) => void
  ): grpcWeb.ClientReadableStream<interests_pb.CreateInterestResponse>;

  updateInterest(
    request: interests_pb.UpdateInterestRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: interests_pb.UpdateInterestResponse) => void
  ): grpcWeb.ClientReadableStream<interests_pb.UpdateInterestResponse>;

  removeInterest(
    request: interests_pb.RemoveInterestRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: interests_pb.RemoveInterestResponse) => void
  ): grpcWeb.ClientReadableStream<interests_pb.RemoveInterestResponse>;

}

export class InterestsServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getAllInterests(
    request: interests_pb.GetAllInterestsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<interests_pb.GetAllInterestsResponse>;

  createInterest(
    request: interests_pb.CreateInterestRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<interests_pb.CreateInterestResponse>;

  updateInterest(
    request: interests_pb.UpdateInterestRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<interests_pb.UpdateInterestResponse>;

  removeInterest(
    request: interests_pb.RemoveInterestRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<interests_pb.RemoveInterestResponse>;

}

