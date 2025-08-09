import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class PersonalTag extends jspb.Message {
  getId(): string;
  setId(value: string): PersonalTag;

  getUserId(): string;
  setUserId(value: string): PersonalTag;

  getName(): string;
  setName(value: string): PersonalTag;

  getTagType(): string;
  setTagType(value: string): PersonalTag;

  getDescription(): string;
  setDescription(value: string): PersonalTag;

  getSource(): string;
  setSource(value: string): PersonalTag;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): PersonalTag;
  hasCreatedAt(): boolean;
  clearCreatedAt(): PersonalTag;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): PersonalTag;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): PersonalTag;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PersonalTag.AsObject;
  static toObject(includeInstance: boolean, msg: PersonalTag): PersonalTag.AsObject;
  static serializeBinaryToWriter(message: PersonalTag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PersonalTag;
  static deserializeBinaryFromReader(message: PersonalTag, reader: jspb.BinaryReader): PersonalTag;
}

export namespace PersonalTag {
  export type AsObject = {
    id: string,
    userId: string,
    name: string,
    tagType: string,
    description: string,
    source: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class CreatePersonalTagParams extends jspb.Message {
  getName(): string;
  setName(value: string): CreatePersonalTagParams;

  getDescription(): string;
  setDescription(value: string): CreatePersonalTagParams;

  getTagType(): string;
  setTagType(value: string): CreatePersonalTagParams;

  getActive(): boolean;
  setActive(value: boolean): CreatePersonalTagParams;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreatePersonalTagParams.AsObject;
  static toObject(includeInstance: boolean, msg: CreatePersonalTagParams): CreatePersonalTagParams.AsObject;
  static serializeBinaryToWriter(message: CreatePersonalTagParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreatePersonalTagParams;
  static deserializeBinaryFromReader(message: CreatePersonalTagParams, reader: jspb.BinaryReader): CreatePersonalTagParams;
}

export namespace CreatePersonalTagParams {
  export type AsObject = {
    name: string,
    description: string,
    tagType: string,
    active: boolean,
  }
}

export class UpdatePersonalTagParams extends jspb.Message {
  getName(): string;
  setName(value: string): UpdatePersonalTagParams;

  getDescription(): string;
  setDescription(value: string): UpdatePersonalTagParams;

  getTagType(): string;
  setTagType(value: string): UpdatePersonalTagParams;

  getActive(): boolean;
  setActive(value: boolean): UpdatePersonalTagParams;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdatePersonalTagParams.AsObject;
  static toObject(includeInstance: boolean, msg: UpdatePersonalTagParams): UpdatePersonalTagParams.AsObject;
  static serializeBinaryToWriter(message: UpdatePersonalTagParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdatePersonalTagParams;
  static deserializeBinaryFromReader(message: UpdatePersonalTagParams, reader: jspb.BinaryReader): UpdatePersonalTagParams;
}

export namespace UpdatePersonalTagParams {
  export type AsObject = {
    name: string,
    description: string,
    tagType: string,
    active: boolean,
  }
}

export class GetTagsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetTagsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetTagsRequest;
  hasRequest(): boolean;
  clearRequest(): GetTagsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTagsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTagsRequest): GetTagsRequest.AsObject;
  static serializeBinaryToWriter(message: GetTagsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTagsRequest;
  static deserializeBinaryFromReader(message: GetTagsRequest, reader: jspb.BinaryReader): GetTagsRequest;
}

export namespace GetTagsRequest {
  export type AsObject = {
    userId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetTagsResponse extends jspb.Message {
  getTagsList(): Array<PersonalTag>;
  setTagsList(value: Array<PersonalTag>): GetTagsResponse;
  clearTagsList(): GetTagsResponse;
  addTags(value?: PersonalTag, index?: number): PersonalTag;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetTagsResponse;
  hasResponse(): boolean;
  clearResponse(): GetTagsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTagsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTagsResponse): GetTagsResponse.AsObject;
  static serializeBinaryToWriter(message: GetTagsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTagsResponse;
  static deserializeBinaryFromReader(message: GetTagsResponse, reader: jspb.BinaryReader): GetTagsResponse;
}

export namespace GetTagsResponse {
  export type AsObject = {
    tagsList: Array<PersonalTag.AsObject>,
    response?: BaseResponse.AsObject,
  }
}

export class GetTagRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetTagRequest;

  getTagId(): string;
  setTagId(value: string): GetTagRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetTagRequest;
  hasRequest(): boolean;
  clearRequest(): GetTagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTagRequest): GetTagRequest.AsObject;
  static serializeBinaryToWriter(message: GetTagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTagRequest;
  static deserializeBinaryFromReader(message: GetTagRequest, reader: jspb.BinaryReader): GetTagRequest;
}

export namespace GetTagRequest {
  export type AsObject = {
    userId: string,
    tagId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetTagResponse extends jspb.Message {
  getTag(): PersonalTag | undefined;
  setTag(value?: PersonalTag): GetTagResponse;
  hasTag(): boolean;
  clearTag(): GetTagResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetTagResponse;
  hasResponse(): boolean;
  clearResponse(): GetTagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTagResponse): GetTagResponse.AsObject;
  static serializeBinaryToWriter(message: GetTagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTagResponse;
  static deserializeBinaryFromReader(message: GetTagResponse, reader: jspb.BinaryReader): GetTagResponse;
}

export namespace GetTagResponse {
  export type AsObject = {
    tag?: PersonalTag.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class CreateTagRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): CreateTagRequest;

  getTag(): CreatePersonalTagParams | undefined;
  setTag(value?: CreatePersonalTagParams): CreateTagRequest;
  hasTag(): boolean;
  clearTag(): CreateTagRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): CreateTagRequest;
  hasRequest(): boolean;
  clearRequest(): CreateTagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateTagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateTagRequest): CreateTagRequest.AsObject;
  static serializeBinaryToWriter(message: CreateTagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateTagRequest;
  static deserializeBinaryFromReader(message: CreateTagRequest, reader: jspb.BinaryReader): CreateTagRequest;
}

export namespace CreateTagRequest {
  export type AsObject = {
    userId: string,
    tag?: CreatePersonalTagParams.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class CreateTagResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): CreateTagResponse;

  getMessage(): string;
  setMessage(value: string): CreateTagResponse;

  getTag(): PersonalTag | undefined;
  setTag(value?: PersonalTag): CreateTagResponse;
  hasTag(): boolean;
  clearTag(): CreateTagResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): CreateTagResponse;
  hasResponse(): boolean;
  clearResponse(): CreateTagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateTagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateTagResponse): CreateTagResponse.AsObject;
  static serializeBinaryToWriter(message: CreateTagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateTagResponse;
  static deserializeBinaryFromReader(message: CreateTagResponse, reader: jspb.BinaryReader): CreateTagResponse;
}

export namespace CreateTagResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    tag?: PersonalTag.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class UpdateTagRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): UpdateTagRequest;

  getTagId(): string;
  setTagId(value: string): UpdateTagRequest;

  getTag(): UpdatePersonalTagParams | undefined;
  setTag(value?: UpdatePersonalTagParams): UpdateTagRequest;
  hasTag(): boolean;
  clearTag(): UpdateTagRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): UpdateTagRequest;
  hasRequest(): boolean;
  clearRequest(): UpdateTagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateTagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateTagRequest): UpdateTagRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateTagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateTagRequest;
  static deserializeBinaryFromReader(message: UpdateTagRequest, reader: jspb.BinaryReader): UpdateTagRequest;
}

export namespace UpdateTagRequest {
  export type AsObject = {
    userId: string,
    tagId: string,
    tag?: UpdatePersonalTagParams.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class UpdateTagResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UpdateTagResponse;

  getMessage(): string;
  setMessage(value: string): UpdateTagResponse;

  getTag(): PersonalTag | undefined;
  setTag(value?: PersonalTag): UpdateTagResponse;
  hasTag(): boolean;
  clearTag(): UpdateTagResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): UpdateTagResponse;
  hasResponse(): boolean;
  clearResponse(): UpdateTagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateTagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateTagResponse): UpdateTagResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateTagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateTagResponse;
  static deserializeBinaryFromReader(message: UpdateTagResponse, reader: jspb.BinaryReader): UpdateTagResponse;
}

export namespace UpdateTagResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    tag?: PersonalTag.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class DeleteTagRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): DeleteTagRequest;

  getTagId(): string;
  setTagId(value: string): DeleteTagRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): DeleteTagRequest;
  hasRequest(): boolean;
  clearRequest(): DeleteTagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteTagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteTagRequest): DeleteTagRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteTagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteTagRequest;
  static deserializeBinaryFromReader(message: DeleteTagRequest, reader: jspb.BinaryReader): DeleteTagRequest;
}

export namespace DeleteTagRequest {
  export type AsObject = {
    userId: string,
    tagId: string,
    request?: BaseRequest.AsObject,
  }
}

export class DeleteTagResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): DeleteTagResponse;

  getMessage(): string;
  setMessage(value: string): DeleteTagResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): DeleteTagResponse;
  hasResponse(): boolean;
  clearResponse(): DeleteTagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteTagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteTagResponse): DeleteTagResponse.AsObject;
  static serializeBinaryToWriter(message: DeleteTagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteTagResponse;
  static deserializeBinaryFromReader(message: DeleteTagResponse, reader: jspb.BinaryReader): DeleteTagResponse;
}

export namespace DeleteTagResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    response?: BaseResponse.AsObject,
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

