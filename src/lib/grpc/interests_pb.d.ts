import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class Interest extends jspb.Message {
  getId(): string;
  setId(value: string): Interest;

  getName(): string;
  setName(value: string): Interest;

  getDescription(): string;
  setDescription(value: string): Interest;

  getActive(): boolean;
  setActive(value: boolean): Interest;

  getSource(): string;
  setSource(value: string): Interest;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Interest;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Interest;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Interest;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): Interest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Interest.AsObject;
  static toObject(includeInstance: boolean, msg: Interest): Interest.AsObject;
  static serializeBinaryToWriter(message: Interest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Interest;
  static deserializeBinaryFromReader(message: Interest, reader: jspb.BinaryReader): Interest;
}

export namespace Interest {
  export type AsObject = {
    id: string,
    name: string,
    description: string,
    active: boolean,
    source: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class CreateInterestParams extends jspb.Message {
  getName(): string;
  setName(value: string): CreateInterestParams;

  getDescription(): string;
  setDescription(value: string): CreateInterestParams;

  getActive(): boolean;
  setActive(value: boolean): CreateInterestParams;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateInterestParams.AsObject;
  static toObject(includeInstance: boolean, msg: CreateInterestParams): CreateInterestParams.AsObject;
  static serializeBinaryToWriter(message: CreateInterestParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateInterestParams;
  static deserializeBinaryFromReader(message: CreateInterestParams, reader: jspb.BinaryReader): CreateInterestParams;
}

export namespace CreateInterestParams {
  export type AsObject = {
    name: string,
    description: string,
    active: boolean,
  }
}

export class UpdateInterestParams extends jspb.Message {
  getName(): string;
  setName(value: string): UpdateInterestParams;

  getDescription(): string;
  setDescription(value: string): UpdateInterestParams;

  getActive(): boolean;
  setActive(value: boolean): UpdateInterestParams;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateInterestParams.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateInterestParams): UpdateInterestParams.AsObject;
  static serializeBinaryToWriter(message: UpdateInterestParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateInterestParams;
  static deserializeBinaryFromReader(message: UpdateInterestParams, reader: jspb.BinaryReader): UpdateInterestParams;
}

export namespace UpdateInterestParams {
  export type AsObject = {
    name: string,
    description: string,
    active: boolean,
  }
}

export class GetAllInterestsRequest extends jspb.Message {
  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetAllInterestsRequest;
  hasRequest(): boolean;
  clearRequest(): GetAllInterestsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllInterestsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllInterestsRequest): GetAllInterestsRequest.AsObject;
  static serializeBinaryToWriter(message: GetAllInterestsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllInterestsRequest;
  static deserializeBinaryFromReader(message: GetAllInterestsRequest, reader: jspb.BinaryReader): GetAllInterestsRequest;
}

export namespace GetAllInterestsRequest {
  export type AsObject = {
    request?: BaseRequest.AsObject,
  }
}

export class GetAllInterestsResponse extends jspb.Message {
  getInterestsList(): Array<Interest>;
  setInterestsList(value: Array<Interest>): GetAllInterestsResponse;
  clearInterestsList(): GetAllInterestsResponse;
  addInterests(value?: Interest, index?: number): Interest;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetAllInterestsResponse;
  hasResponse(): boolean;
  clearResponse(): GetAllInterestsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllInterestsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllInterestsResponse): GetAllInterestsResponse.AsObject;
  static serializeBinaryToWriter(message: GetAllInterestsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllInterestsResponse;
  static deserializeBinaryFromReader(message: GetAllInterestsResponse, reader: jspb.BinaryReader): GetAllInterestsResponse;
}

export namespace GetAllInterestsResponse {
  export type AsObject = {
    interestsList: Array<Interest.AsObject>,
    response?: BaseResponse.AsObject,
  }
}

export class CreateInterestRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): CreateInterestRequest;

  getInterest(): CreateInterestParams | undefined;
  setInterest(value?: CreateInterestParams): CreateInterestRequest;
  hasInterest(): boolean;
  clearInterest(): CreateInterestRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): CreateInterestRequest;
  hasRequest(): boolean;
  clearRequest(): CreateInterestRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateInterestRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateInterestRequest): CreateInterestRequest.AsObject;
  static serializeBinaryToWriter(message: CreateInterestRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateInterestRequest;
  static deserializeBinaryFromReader(message: CreateInterestRequest, reader: jspb.BinaryReader): CreateInterestRequest;
}

export namespace CreateInterestRequest {
  export type AsObject = {
    userId: string,
    interest?: CreateInterestParams.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class CreateInterestResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): CreateInterestResponse;

  getMessage(): string;
  setMessage(value: string): CreateInterestResponse;

  getInterest(): Interest | undefined;
  setInterest(value?: Interest): CreateInterestResponse;
  hasInterest(): boolean;
  clearInterest(): CreateInterestResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): CreateInterestResponse;
  hasResponse(): boolean;
  clearResponse(): CreateInterestResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateInterestResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateInterestResponse): CreateInterestResponse.AsObject;
  static serializeBinaryToWriter(message: CreateInterestResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateInterestResponse;
  static deserializeBinaryFromReader(message: CreateInterestResponse, reader: jspb.BinaryReader): CreateInterestResponse;
}

export namespace CreateInterestResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    interest?: Interest.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class UpdateInterestRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): UpdateInterestRequest;

  getInterestId(): string;
  setInterestId(value: string): UpdateInterestRequest;

  getInterest(): UpdateInterestParams | undefined;
  setInterest(value?: UpdateInterestParams): UpdateInterestRequest;
  hasInterest(): boolean;
  clearInterest(): UpdateInterestRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): UpdateInterestRequest;
  hasRequest(): boolean;
  clearRequest(): UpdateInterestRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateInterestRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateInterestRequest): UpdateInterestRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateInterestRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateInterestRequest;
  static deserializeBinaryFromReader(message: UpdateInterestRequest, reader: jspb.BinaryReader): UpdateInterestRequest;
}

export namespace UpdateInterestRequest {
  export type AsObject = {
    userId: string,
    interestId: string,
    interest?: UpdateInterestParams.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class UpdateInterestResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UpdateInterestResponse;

  getMessage(): string;
  setMessage(value: string): UpdateInterestResponse;

  getInterest(): Interest | undefined;
  setInterest(value?: Interest): UpdateInterestResponse;
  hasInterest(): boolean;
  clearInterest(): UpdateInterestResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): UpdateInterestResponse;
  hasResponse(): boolean;
  clearResponse(): UpdateInterestResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateInterestResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateInterestResponse): UpdateInterestResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateInterestResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateInterestResponse;
  static deserializeBinaryFromReader(message: UpdateInterestResponse, reader: jspb.BinaryReader): UpdateInterestResponse;
}

export namespace UpdateInterestResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    interest?: Interest.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class RemoveInterestRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): RemoveInterestRequest;

  getInterestId(): string;
  setInterestId(value: string): RemoveInterestRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): RemoveInterestRequest;
  hasRequest(): boolean;
  clearRequest(): RemoveInterestRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveInterestRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveInterestRequest): RemoveInterestRequest.AsObject;
  static serializeBinaryToWriter(message: RemoveInterestRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveInterestRequest;
  static deserializeBinaryFromReader(message: RemoveInterestRequest, reader: jspb.BinaryReader): RemoveInterestRequest;
}

export namespace RemoveInterestRequest {
  export type AsObject = {
    userId: string,
    interestId: string,
    request?: BaseRequest.AsObject,
  }
}

export class RemoveInterestResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): RemoveInterestResponse;

  getMessage(): string;
  setMessage(value: string): RemoveInterestResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): RemoveInterestResponse;
  hasResponse(): boolean;
  clearResponse(): RemoveInterestResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveInterestResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveInterestResponse): RemoveInterestResponse.AsObject;
  static serializeBinaryToWriter(message: RemoveInterestResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveInterestResponse;
  static deserializeBinaryFromReader(message: RemoveInterestResponse, reader: jspb.BinaryReader): RemoveInterestResponse;
}

export namespace RemoveInterestResponse {
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

