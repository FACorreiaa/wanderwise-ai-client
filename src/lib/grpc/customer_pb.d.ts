import * as jspb from 'google-protobuf'



export class GetCustomerReq extends jspb.Message {
  getPublicId(): string;
  setPublicId(value: string): GetCustomerReq;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetCustomerReq;
  hasRequest(): boolean;
  clearRequest(): GetCustomerReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCustomerReq.AsObject;
  static toObject(includeInstance: boolean, msg: GetCustomerReq): GetCustomerReq.AsObject;
  static serializeBinaryToWriter(message: GetCustomerReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCustomerReq;
  static deserializeBinaryFromReader(message: GetCustomerReq, reader: jspb.BinaryReader): GetCustomerReq;
}

export namespace GetCustomerReq {
  export type AsObject = {
    publicId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetCustomerRes extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): GetCustomerRes;

  getMessage(): string;
  setMessage(value: string): GetCustomerRes;

  getCustomer(): XCustomer | undefined;
  setCustomer(value?: XCustomer): GetCustomerRes;
  hasCustomer(): boolean;
  clearCustomer(): GetCustomerRes;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetCustomerRes;
  hasResponse(): boolean;
  clearResponse(): GetCustomerRes;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCustomerRes.AsObject;
  static toObject(includeInstance: boolean, msg: GetCustomerRes): GetCustomerRes.AsObject;
  static serializeBinaryToWriter(message: GetCustomerRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCustomerRes;
  static deserializeBinaryFromReader(message: GetCustomerRes, reader: jspb.BinaryReader): GetCustomerRes;
}

export namespace GetCustomerRes {
  export type AsObject = {
    success: boolean,
    message: string,
    customer?: XCustomer.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class CreateCustomerReq extends jspb.Message {
  getCustomer(): XCustomer | undefined;
  setCustomer(value?: XCustomer): CreateCustomerReq;
  hasCustomer(): boolean;
  clearCustomer(): CreateCustomerReq;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): CreateCustomerReq;
  hasRequest(): boolean;
  clearRequest(): CreateCustomerReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateCustomerReq.AsObject;
  static toObject(includeInstance: boolean, msg: CreateCustomerReq): CreateCustomerReq.AsObject;
  static serializeBinaryToWriter(message: CreateCustomerReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateCustomerReq;
  static deserializeBinaryFromReader(message: CreateCustomerReq, reader: jspb.BinaryReader): CreateCustomerReq;
}

export namespace CreateCustomerReq {
  export type AsObject = {
    customer?: XCustomer.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class CreateCustomerRes extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): CreateCustomerRes;

  getMessage(): string;
  setMessage(value: string): CreateCustomerRes;

  getCustomer(): XCustomer | undefined;
  setCustomer(value?: XCustomer): CreateCustomerRes;
  hasCustomer(): boolean;
  clearCustomer(): CreateCustomerRes;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): CreateCustomerRes;
  hasResponse(): boolean;
  clearResponse(): CreateCustomerRes;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateCustomerRes.AsObject;
  static toObject(includeInstance: boolean, msg: CreateCustomerRes): CreateCustomerRes.AsObject;
  static serializeBinaryToWriter(message: CreateCustomerRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateCustomerRes;
  static deserializeBinaryFromReader(message: CreateCustomerRes, reader: jspb.BinaryReader): CreateCustomerRes;
}

export namespace CreateCustomerRes {
  export type AsObject = {
    success: boolean,
    message: string,
    customer?: XCustomer.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class UpdateCustomerReq extends jspb.Message {
  getCustomerId(): string;
  setCustomerId(value: string): UpdateCustomerReq;

  getUpdatesList(): Array<XDiff>;
  setUpdatesList(value: Array<XDiff>): UpdateCustomerReq;
  clearUpdatesList(): UpdateCustomerReq;
  addUpdates(value?: XDiff, index?: number): XDiff;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): UpdateCustomerReq;
  hasRequest(): boolean;
  clearRequest(): UpdateCustomerReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateCustomerReq.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateCustomerReq): UpdateCustomerReq.AsObject;
  static serializeBinaryToWriter(message: UpdateCustomerReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateCustomerReq;
  static deserializeBinaryFromReader(message: UpdateCustomerReq, reader: jspb.BinaryReader): UpdateCustomerReq;
}

export namespace UpdateCustomerReq {
  export type AsObject = {
    customerId: string,
    updatesList: Array<XDiff.AsObject>,
    request?: BaseRequest.AsObject,
  }
}

export class UpdateCustomerRes extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UpdateCustomerRes;

  getMessage(): string;
  setMessage(value: string): UpdateCustomerRes;

  getCustomer(): XCustomer | undefined;
  setCustomer(value?: XCustomer): UpdateCustomerRes;
  hasCustomer(): boolean;
  clearCustomer(): UpdateCustomerRes;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): UpdateCustomerRes;
  hasResponse(): boolean;
  clearResponse(): UpdateCustomerRes;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateCustomerRes.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateCustomerRes): UpdateCustomerRes.AsObject;
  static serializeBinaryToWriter(message: UpdateCustomerRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateCustomerRes;
  static deserializeBinaryFromReader(message: UpdateCustomerRes, reader: jspb.BinaryReader): UpdateCustomerRes;
}

export namespace UpdateCustomerRes {
  export type AsObject = {
    success: boolean,
    message: string,
    customer?: XCustomer.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class DeleteCustomerReq extends jspb.Message {
  getCustomerId(): string;
  setCustomerId(value: string): DeleteCustomerReq;

  getHardDelete(): boolean;
  setHardDelete(value: boolean): DeleteCustomerReq;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): DeleteCustomerReq;
  hasRequest(): boolean;
  clearRequest(): DeleteCustomerReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteCustomerReq.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteCustomerReq): DeleteCustomerReq.AsObject;
  static serializeBinaryToWriter(message: DeleteCustomerReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteCustomerReq;
  static deserializeBinaryFromReader(message: DeleteCustomerReq, reader: jspb.BinaryReader): DeleteCustomerReq;
}

export namespace DeleteCustomerReq {
  export type AsObject = {
    customerId: string,
    hardDelete: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class NilRes extends jspb.Message {
  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): NilRes;
  hasResponse(): boolean;
  clearResponse(): NilRes;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NilRes.AsObject;
  static toObject(includeInstance: boolean, msg: NilRes): NilRes.AsObject;
  static serializeBinaryToWriter(message: NilRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NilRes;
  static deserializeBinaryFromReader(message: NilRes, reader: jspb.BinaryReader): NilRes;
}

export namespace NilRes {
  export type AsObject = {
    response?: BaseResponse.AsObject,
  }
}

export class XCustomer extends jspb.Message {
  getPublicId(): string;
  setPublicId(value: string): XCustomer;

  getPrivateId(): string;
  setPrivateId(value: string): XCustomer;

  getName(): XName | undefined;
  setName(value?: XName): XCustomer;
  hasName(): boolean;
  clearName(): XCustomer;

  getEmail(): string;
  setEmail(value: string): XCustomer;

  getPhone(): string;
  setPhone(value: string): XCustomer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): XCustomer.AsObject;
  static toObject(includeInstance: boolean, msg: XCustomer): XCustomer.AsObject;
  static serializeBinaryToWriter(message: XCustomer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): XCustomer;
  static deserializeBinaryFromReader(message: XCustomer, reader: jspb.BinaryReader): XCustomer;
}

export namespace XCustomer {
  export type AsObject = {
    publicId: string,
    privateId: string,
    name?: XName.AsObject,
    email: string,
    phone: string,
  }
}

export class XName extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): XName;

  getFirst(): string;
  setFirst(value: string): XName;

  getMiddle(): string;
  setMiddle(value: string): XName;

  getLast(): string;
  setLast(value: string): XName;

  getSuffix(): string;
  setSuffix(value: string): XName;

  getNickname(): string;
  setNickname(value: string): XName;

  getFull(): string;
  setFull(value: string): XName;

  getFriendly(): string;
  setFriendly(value: string): XName;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): XName.AsObject;
  static toObject(includeInstance: boolean, msg: XName): XName.AsObject;
  static serializeBinaryToWriter(message: XName, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): XName;
  static deserializeBinaryFromReader(message: XName, reader: jspb.BinaryReader): XName;
}

export namespace XName {
  export type AsObject = {
    title: string,
    first: string,
    middle: string,
    last: string,
    suffix: string,
    nickname: string,
    full: string,
    friendly: string,
  }
}

export class XDiff extends jspb.Message {
  getField(): string;
  setField(value: string): XDiff;

  getOldValue(): string;
  setOldValue(value: string): XDiff;

  getNewValue(): string;
  setNewValue(value: string): XDiff;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): XDiff.AsObject;
  static toObject(includeInstance: boolean, msg: XDiff): XDiff.AsObject;
  static serializeBinaryToWriter(message: XDiff, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): XDiff;
  static deserializeBinaryFromReader(message: XDiff, reader: jspb.BinaryReader): XDiff;
}

export namespace XDiff {
  export type AsObject = {
    field: string,
    oldValue: string,
    newValue: string,
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

