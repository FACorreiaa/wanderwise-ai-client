import * as grpcWeb from 'grpc-web';

import * as auth_pb from './auth_pb'; // proto import: "auth.proto"


export class AuthServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  register(
    request: auth_pb.RegisterRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: auth_pb.RegisterResponse) => void
  ): grpcWeb.ClientReadableStream<auth_pb.RegisterResponse>;

  login(
    request: auth_pb.LoginRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: auth_pb.LoginResponse) => void
  ): grpcWeb.ClientReadableStream<auth_pb.LoginResponse>;

  refreshToken(
    request: auth_pb.RefreshTokenRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: auth_pb.TokenResponse) => void
  ): grpcWeb.ClientReadableStream<auth_pb.TokenResponse>;

  logout(
    request: auth_pb.LogoutRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: auth_pb.LogoutResponse) => void
  ): grpcWeb.ClientReadableStream<auth_pb.LogoutResponse>;

  validateSession(
    request: auth_pb.ValidateSessionRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: auth_pb.ValidateSessionResponse) => void
  ): grpcWeb.ClientReadableStream<auth_pb.ValidateSessionResponse>;

  updatePassword(
    request: auth_pb.UpdatePasswordRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: auth_pb.UpdatePasswordResponse) => void
  ): grpcWeb.ClientReadableStream<auth_pb.UpdatePasswordResponse>;

  googleLogin(
    request: auth_pb.GoogleLoginRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: auth_pb.GoogleLoginResponse) => void
  ): grpcWeb.ClientReadableStream<auth_pb.GoogleLoginResponse>;

  googleCallback(
    request: auth_pb.GoogleCallbackRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: auth_pb.LoginResponse) => void
  ): grpcWeb.ClientReadableStream<auth_pb.LoginResponse>;

}

export class AuthServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  register(
    request: auth_pb.RegisterRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<auth_pb.RegisterResponse>;

  login(
    request: auth_pb.LoginRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<auth_pb.LoginResponse>;

  refreshToken(
    request: auth_pb.RefreshTokenRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<auth_pb.TokenResponse>;

  logout(
    request: auth_pb.LogoutRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<auth_pb.LogoutResponse>;

  validateSession(
    request: auth_pb.ValidateSessionRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<auth_pb.ValidateSessionResponse>;

  updatePassword(
    request: auth_pb.UpdatePasswordRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<auth_pb.UpdatePasswordResponse>;

  googleLogin(
    request: auth_pb.GoogleLoginRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<auth_pb.GoogleLoginResponse>;

  googleCallback(
    request: auth_pb.GoogleCallbackRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<auth_pb.LoginResponse>;

}

