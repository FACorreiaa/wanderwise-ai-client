import * as grpcWeb from 'grpc-web';

import * as tags_pb from './tags_pb'; // proto import: "tags.proto"


export class TagsServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getTags(
    request: tags_pb.GetTagsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: tags_pb.GetTagsResponse) => void
  ): grpcWeb.ClientReadableStream<tags_pb.GetTagsResponse>;

  getTag(
    request: tags_pb.GetTagRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: tags_pb.GetTagResponse) => void
  ): grpcWeb.ClientReadableStream<tags_pb.GetTagResponse>;

  createTag(
    request: tags_pb.CreateTagRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: tags_pb.CreateTagResponse) => void
  ): grpcWeb.ClientReadableStream<tags_pb.CreateTagResponse>;

  updateTag(
    request: tags_pb.UpdateTagRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: tags_pb.UpdateTagResponse) => void
  ): grpcWeb.ClientReadableStream<tags_pb.UpdateTagResponse>;

  deleteTag(
    request: tags_pb.DeleteTagRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: tags_pb.DeleteTagResponse) => void
  ): grpcWeb.ClientReadableStream<tags_pb.DeleteTagResponse>;

}

export class TagsServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getTags(
    request: tags_pb.GetTagsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<tags_pb.GetTagsResponse>;

  getTag(
    request: tags_pb.GetTagRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<tags_pb.GetTagResponse>;

  createTag(
    request: tags_pb.CreateTagRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<tags_pb.CreateTagResponse>;

  updateTag(
    request: tags_pb.UpdateTagRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<tags_pb.UpdateTagResponse>;

  deleteTag(
    request: tags_pb.DeleteTagRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<tags_pb.DeleteTagResponse>;

}

