import * as grpcWeb from 'grpc-web';

import * as profiles_pb from './profiles_pb'; // proto import: "profiles.proto"


export class ProfilesServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getSearchProfiles(
    request: profiles_pb.GetSearchProfilesRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: profiles_pb.GetSearchProfilesResponse) => void
  ): grpcWeb.ClientReadableStream<profiles_pb.GetSearchProfilesResponse>;

  getSearchProfile(
    request: profiles_pb.GetSearchProfileRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: profiles_pb.GetSearchProfileResponse) => void
  ): grpcWeb.ClientReadableStream<profiles_pb.GetSearchProfileResponse>;

  getDefaultSearchProfile(
    request: profiles_pb.GetDefaultSearchProfileRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: profiles_pb.GetDefaultSearchProfileResponse) => void
  ): grpcWeb.ClientReadableStream<profiles_pb.GetDefaultSearchProfileResponse>;

  createSearchProfile(
    request: profiles_pb.CreateSearchProfileRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: profiles_pb.CreateSearchProfileResponse) => void
  ): grpcWeb.ClientReadableStream<profiles_pb.CreateSearchProfileResponse>;

  updateSearchProfile(
    request: profiles_pb.UpdateSearchProfileRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: profiles_pb.UpdateSearchProfileResponse) => void
  ): grpcWeb.ClientReadableStream<profiles_pb.UpdateSearchProfileResponse>;

  deleteSearchProfile(
    request: profiles_pb.DeleteSearchProfileRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: profiles_pb.DeleteSearchProfileResponse) => void
  ): grpcWeb.ClientReadableStream<profiles_pb.DeleteSearchProfileResponse>;

  setDefaultSearchProfile(
    request: profiles_pb.SetDefaultSearchProfileRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: profiles_pb.SetDefaultSearchProfileResponse) => void
  ): grpcWeb.ClientReadableStream<profiles_pb.SetDefaultSearchProfileResponse>;

}

export class ProfilesServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getSearchProfiles(
    request: profiles_pb.GetSearchProfilesRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<profiles_pb.GetSearchProfilesResponse>;

  getSearchProfile(
    request: profiles_pb.GetSearchProfileRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<profiles_pb.GetSearchProfileResponse>;

  getDefaultSearchProfile(
    request: profiles_pb.GetDefaultSearchProfileRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<profiles_pb.GetDefaultSearchProfileResponse>;

  createSearchProfile(
    request: profiles_pb.CreateSearchProfileRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<profiles_pb.CreateSearchProfileResponse>;

  updateSearchProfile(
    request: profiles_pb.UpdateSearchProfileRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<profiles_pb.UpdateSearchProfileResponse>;

  deleteSearchProfile(
    request: profiles_pb.DeleteSearchProfileRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<profiles_pb.DeleteSearchProfileResponse>;

  setDefaultSearchProfile(
    request: profiles_pb.SetDefaultSearchProfileRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<profiles_pb.SetDefaultSearchProfileResponse>;

}

