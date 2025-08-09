import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class UserAuth extends jspb.Message {
  getId(): string;
  setId(value: string): UserAuth;

  getUsername(): string;
  setUsername(value: string): UserAuth;

  getEmail(): string;
  setEmail(value: string): UserAuth;

  getRole(): string;
  setRole(value: string): UserAuth;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): UserAuth;
  hasCreatedAt(): boolean;
  clearCreatedAt(): UserAuth;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): UserAuth;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): UserAuth;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserAuth.AsObject;
  static toObject(includeInstance: boolean, msg: UserAuth): UserAuth.AsObject;
  static serializeBinaryToWriter(message: UserAuth, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserAuth;
  static deserializeBinaryFromReader(message: UserAuth, reader: jspb.BinaryReader): UserAuth;
}

export namespace UserAuth {
  export type AsObject = {
    id: string,
    username: string,
    email: string,
    role: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class RegisterRequest extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): RegisterRequest;

  getEmail(): string;
  setEmail(value: string): RegisterRequest;

  getPassword(): string;
  setPassword(value: string): RegisterRequest;

  getConfirmPassword(): string;
  setConfirmPassword(value: string): RegisterRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): RegisterRequest;
  hasRequest(): boolean;
  clearRequest(): RegisterRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterRequest): RegisterRequest.AsObject;
  static serializeBinaryToWriter(message: RegisterRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterRequest;
  static deserializeBinaryFromReader(message: RegisterRequest, reader: jspb.BinaryReader): RegisterRequest;
}

export namespace RegisterRequest {
  export type AsObject = {
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    request?: BaseRequest.AsObject,
  }
}

export class RegisterResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): RegisterResponse;

  getMessage(): string;
  setMessage(value: string): RegisterResponse;

  getUser(): UserAuth | undefined;
  setUser(value?: UserAuth): RegisterResponse;
  hasUser(): boolean;
  clearUser(): RegisterResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): RegisterResponse;
  hasResponse(): boolean;
  clearResponse(): RegisterResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterResponse): RegisterResponse.AsObject;
  static serializeBinaryToWriter(message: RegisterResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterResponse;
  static deserializeBinaryFromReader(message: RegisterResponse, reader: jspb.BinaryReader): RegisterResponse;
}

export namespace RegisterResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    user?: UserAuth.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class LoginRequest extends jspb.Message {
  getEmail(): string;
  setEmail(value: string): LoginRequest;

  getPassword(): string;
  setPassword(value: string): LoginRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): LoginRequest;
  hasRequest(): boolean;
  clearRequest(): LoginRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LoginRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LoginRequest): LoginRequest.AsObject;
  static serializeBinaryToWriter(message: LoginRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LoginRequest;
  static deserializeBinaryFromReader(message: LoginRequest, reader: jspb.BinaryReader): LoginRequest;
}

export namespace LoginRequest {
  export type AsObject = {
    email: string,
    password: string,
    request?: BaseRequest.AsObject,
  }
}

export class LoginResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): LoginResponse;

  getMessage(): string;
  setMessage(value: string): LoginResponse;

  getAccessToken(): string;
  setAccessToken(value: string): LoginResponse;

  getRefreshToken(): string;
  setRefreshToken(value: string): LoginResponse;

  getExpiresIn(): number;
  setExpiresIn(value: number): LoginResponse;

  getUser(): UserAuth | undefined;
  setUser(value?: UserAuth): LoginResponse;
  hasUser(): boolean;
  clearUser(): LoginResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): LoginResponse;
  hasResponse(): boolean;
  clearResponse(): LoginResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LoginResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LoginResponse): LoginResponse.AsObject;
  static serializeBinaryToWriter(message: LoginResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LoginResponse;
  static deserializeBinaryFromReader(message: LoginResponse, reader: jspb.BinaryReader): LoginResponse;
}

export namespace LoginResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    user?: UserAuth.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class RefreshTokenRequest extends jspb.Message {
  getRefreshToken(): string;
  setRefreshToken(value: string): RefreshTokenRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): RefreshTokenRequest;
  hasRequest(): boolean;
  clearRequest(): RefreshTokenRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RefreshTokenRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RefreshTokenRequest): RefreshTokenRequest.AsObject;
  static serializeBinaryToWriter(message: RefreshTokenRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RefreshTokenRequest;
  static deserializeBinaryFromReader(message: RefreshTokenRequest, reader: jspb.BinaryReader): RefreshTokenRequest;
}

export namespace RefreshTokenRequest {
  export type AsObject = {
    refreshToken: string,
    request?: BaseRequest.AsObject,
  }
}

export class TokenResponse extends jspb.Message {
  getAccessToken(): string;
  setAccessToken(value: string): TokenResponse;

  getRefreshToken(): string;
  setRefreshToken(value: string): TokenResponse;

  getExpiresIn(): number;
  setExpiresIn(value: number): TokenResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): TokenResponse;
  hasResponse(): boolean;
  clearResponse(): TokenResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TokenResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TokenResponse): TokenResponse.AsObject;
  static serializeBinaryToWriter(message: TokenResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TokenResponse;
  static deserializeBinaryFromReader(message: TokenResponse, reader: jspb.BinaryReader): TokenResponse;
}

export namespace TokenResponse {
  export type AsObject = {
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    response?: BaseResponse.AsObject,
  }
}

export class LogoutRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): LogoutRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): LogoutRequest;
  hasRequest(): boolean;
  clearRequest(): LogoutRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LogoutRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LogoutRequest): LogoutRequest.AsObject;
  static serializeBinaryToWriter(message: LogoutRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LogoutRequest;
  static deserializeBinaryFromReader(message: LogoutRequest, reader: jspb.BinaryReader): LogoutRequest;
}

export namespace LogoutRequest {
  export type AsObject = {
    userId: string,
    request?: BaseRequest.AsObject,
  }
}

export class LogoutResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): LogoutResponse;

  getMessage(): string;
  setMessage(value: string): LogoutResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): LogoutResponse;
  hasResponse(): boolean;
  clearResponse(): LogoutResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LogoutResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LogoutResponse): LogoutResponse.AsObject;
  static serializeBinaryToWriter(message: LogoutResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LogoutResponse;
  static deserializeBinaryFromReader(message: LogoutResponse, reader: jspb.BinaryReader): LogoutResponse;
}

export namespace LogoutResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    response?: BaseResponse.AsObject,
  }
}

export class ValidateSessionRequest extends jspb.Message {
  getAccessToken(): string;
  setAccessToken(value: string): ValidateSessionRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): ValidateSessionRequest;
  hasRequest(): boolean;
  clearRequest(): ValidateSessionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateSessionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateSessionRequest): ValidateSessionRequest.AsObject;
  static serializeBinaryToWriter(message: ValidateSessionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateSessionRequest;
  static deserializeBinaryFromReader(message: ValidateSessionRequest, reader: jspb.BinaryReader): ValidateSessionRequest;
}

export namespace ValidateSessionRequest {
  export type AsObject = {
    accessToken: string,
    request?: BaseRequest.AsObject,
  }
}

export class ValidateSessionResponse extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): ValidateSessionResponse;

  getUserId(): string;
  setUserId(value: string): ValidateSessionResponse;

  getEmail(): string;
  setEmail(value: string): ValidateSessionResponse;

  getRole(): string;
  setRole(value: string): ValidateSessionResponse;

  getExpiresAt(): number;
  setExpiresAt(value: number): ValidateSessionResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): ValidateSessionResponse;
  hasResponse(): boolean;
  clearResponse(): ValidateSessionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateSessionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateSessionResponse): ValidateSessionResponse.AsObject;
  static serializeBinaryToWriter(message: ValidateSessionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateSessionResponse;
  static deserializeBinaryFromReader(message: ValidateSessionResponse, reader: jspb.BinaryReader): ValidateSessionResponse;
}

export namespace ValidateSessionResponse {
  export type AsObject = {
    valid: boolean,
    userId: string,
    email: string,
    role: string,
    expiresAt: number,
    response?: BaseResponse.AsObject,
  }
}

export class UpdatePasswordRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): UpdatePasswordRequest;

  getCurrentPassword(): string;
  setCurrentPassword(value: string): UpdatePasswordRequest;

  getNewPassword(): string;
  setNewPassword(value: string): UpdatePasswordRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): UpdatePasswordRequest;
  hasRequest(): boolean;
  clearRequest(): UpdatePasswordRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdatePasswordRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdatePasswordRequest): UpdatePasswordRequest.AsObject;
  static serializeBinaryToWriter(message: UpdatePasswordRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdatePasswordRequest;
  static deserializeBinaryFromReader(message: UpdatePasswordRequest, reader: jspb.BinaryReader): UpdatePasswordRequest;
}

export namespace UpdatePasswordRequest {
  export type AsObject = {
    userId: string,
    currentPassword: string,
    newPassword: string,
    request?: BaseRequest.AsObject,
  }
}

export class UpdatePasswordResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UpdatePasswordResponse;

  getMessage(): string;
  setMessage(value: string): UpdatePasswordResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): UpdatePasswordResponse;
  hasResponse(): boolean;
  clearResponse(): UpdatePasswordResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdatePasswordResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdatePasswordResponse): UpdatePasswordResponse.AsObject;
  static serializeBinaryToWriter(message: UpdatePasswordResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdatePasswordResponse;
  static deserializeBinaryFromReader(message: UpdatePasswordResponse, reader: jspb.BinaryReader): UpdatePasswordResponse;
}

export namespace UpdatePasswordResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    response?: BaseResponse.AsObject,
  }
}

export class GoogleLoginRequest extends jspb.Message {
  getRedirectUri(): string;
  setRedirectUri(value: string): GoogleLoginRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GoogleLoginRequest;
  hasRequest(): boolean;
  clearRequest(): GoogleLoginRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GoogleLoginRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GoogleLoginRequest): GoogleLoginRequest.AsObject;
  static serializeBinaryToWriter(message: GoogleLoginRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GoogleLoginRequest;
  static deserializeBinaryFromReader(message: GoogleLoginRequest, reader: jspb.BinaryReader): GoogleLoginRequest;
}

export namespace GoogleLoginRequest {
  export type AsObject = {
    redirectUri: string,
    request?: BaseRequest.AsObject,
  }
}

export class GoogleLoginResponse extends jspb.Message {
  getAuthUrl(): string;
  setAuthUrl(value: string): GoogleLoginResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GoogleLoginResponse;
  hasResponse(): boolean;
  clearResponse(): GoogleLoginResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GoogleLoginResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GoogleLoginResponse): GoogleLoginResponse.AsObject;
  static serializeBinaryToWriter(message: GoogleLoginResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GoogleLoginResponse;
  static deserializeBinaryFromReader(message: GoogleLoginResponse, reader: jspb.BinaryReader): GoogleLoginResponse;
}

export namespace GoogleLoginResponse {
  export type AsObject = {
    authUrl: string,
    response?: BaseResponse.AsObject,
  }
}

export class GoogleCallbackRequest extends jspb.Message {
  getCode(): string;
  setCode(value: string): GoogleCallbackRequest;

  getState(): string;
  setState(value: string): GoogleCallbackRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GoogleCallbackRequest;
  hasRequest(): boolean;
  clearRequest(): GoogleCallbackRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GoogleCallbackRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GoogleCallbackRequest): GoogleCallbackRequest.AsObject;
  static serializeBinaryToWriter(message: GoogleCallbackRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GoogleCallbackRequest;
  static deserializeBinaryFromReader(message: GoogleCallbackRequest, reader: jspb.BinaryReader): GoogleCallbackRequest;
}

export namespace GoogleCallbackRequest {
  export type AsObject = {
    code: string,
    state: string,
    request?: BaseRequest.AsObject,
  }
}

export class Claims extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): Claims;

  getEmail(): string;
  setEmail(value: string): Claims;

  getRole(): string;
  setRole(value: string): Claims;

  getExp(): number;
  setExp(value: number): Claims;

  getIat(): number;
  setIat(value: number): Claims;

  getIss(): string;
  setIss(value: string): Claims;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Claims.AsObject;
  static toObject(includeInstance: boolean, msg: Claims): Claims.AsObject;
  static serializeBinaryToWriter(message: Claims, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Claims;
  static deserializeBinaryFromReader(message: Claims, reader: jspb.BinaryReader): Claims;
}

export namespace Claims {
  export type AsObject = {
    userId: string,
    email: string,
    role: string,
    exp: number,
    iat: number,
    iss: string,
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

