import * as grpcWeb from 'grpc-web';

import * as user_pb from './user_pb'; // proto import: "user.proto"


export class UserServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getUserProfile(
    request: user_pb.GetUserProfileRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.GetUserProfileResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.GetUserProfileResponse>;

  updateUserProfile(
    request: user_pb.UpdateUserProfileRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.UpdateUserProfileResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.UpdateUserProfileResponse>;

  getSearchProfiles(
    request: user_pb.GetSearchProfilesRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.GetSearchProfilesResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.GetSearchProfilesResponse>;

  getSearchProfile(
    request: user_pb.GetSearchProfileRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.GetSearchProfileResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.GetSearchProfileResponse>;

  createSearchProfile(
    request: user_pb.CreateSearchProfileRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.CreateSearchProfileResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.CreateSearchProfileResponse>;

  updateSearchProfile(
    request: user_pb.UpdateSearchProfileRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.UpdateSearchProfileResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.UpdateSearchProfileResponse>;

  deleteSearchProfile(
    request: user_pb.DeleteSearchProfileRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.DeleteSearchProfileResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.DeleteSearchProfileResponse>;

  getDefaultProfile(
    request: user_pb.GetDefaultProfileRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.GetDefaultProfileResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.GetDefaultProfileResponse>;

  setDefaultProfile(
    request: user_pb.SetDefaultProfileRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.SetDefaultProfileResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.SetDefaultProfileResponse>;

  getInterests(
    request: user_pb.GetInterestsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.GetInterestsResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.GetInterestsResponse>;

  createInterest(
    request: user_pb.CreateInterestRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.CreateInterestResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.CreateInterestResponse>;

  updateInterest(
    request: user_pb.UpdateInterestRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.UpdateInterestResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.UpdateInterestResponse>;

  deleteInterest(
    request: user_pb.DeleteInterestRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.DeleteInterestResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.DeleteInterestResponse>;

  getTags(
    request: user_pb.GetTagsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.GetTagsResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.GetTagsResponse>;

  getTag(
    request: user_pb.GetTagRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.GetTagResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.GetTagResponse>;

  createTag(
    request: user_pb.CreateTagRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.CreateTagResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.CreateTagResponse>;

  updateTag(
    request: user_pb.UpdateTagRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.UpdateTagResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.UpdateTagResponse>;

  deleteTag(
    request: user_pb.DeleteTagRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.DeleteTagResponse) => void
  ): grpcWeb.ClientReadableStream<user_pb.DeleteTagResponse>;

}

export class UserServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getUserProfile(
    request: user_pb.GetUserProfileRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.GetUserProfileResponse>;

  updateUserProfile(
    request: user_pb.UpdateUserProfileRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.UpdateUserProfileResponse>;

  getSearchProfiles(
    request: user_pb.GetSearchProfilesRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.GetSearchProfilesResponse>;

  getSearchProfile(
    request: user_pb.GetSearchProfileRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.GetSearchProfileResponse>;

  createSearchProfile(
    request: user_pb.CreateSearchProfileRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.CreateSearchProfileResponse>;

  updateSearchProfile(
    request: user_pb.UpdateSearchProfileRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.UpdateSearchProfileResponse>;

  deleteSearchProfile(
    request: user_pb.DeleteSearchProfileRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.DeleteSearchProfileResponse>;

  getDefaultProfile(
    request: user_pb.GetDefaultProfileRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.GetDefaultProfileResponse>;

  setDefaultProfile(
    request: user_pb.SetDefaultProfileRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.SetDefaultProfileResponse>;

  getInterests(
    request: user_pb.GetInterestsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.GetInterestsResponse>;

  createInterest(
    request: user_pb.CreateInterestRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.CreateInterestResponse>;

  updateInterest(
    request: user_pb.UpdateInterestRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.UpdateInterestResponse>;

  deleteInterest(
    request: user_pb.DeleteInterestRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.DeleteInterestResponse>;

  getTags(
    request: user_pb.GetTagsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.GetTagsResponse>;

  getTag(
    request: user_pb.GetTagRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.GetTagResponse>;

  createTag(
    request: user_pb.CreateTagRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.CreateTagResponse>;

  updateTag(
    request: user_pb.UpdateTagRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.UpdateTagResponse>;

  deleteTag(
    request: user_pb.DeleteTagRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<user_pb.DeleteTagResponse>;

}

