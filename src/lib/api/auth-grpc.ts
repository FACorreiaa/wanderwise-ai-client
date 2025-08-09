import { useQuery, useMutation } from '@tanstack/solid-query';
import * as authPbModule from '../grpc/auth_pb';
import * as authGrpcModule from '../grpc/auth_grpc_web_pb';

const {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutRequest,
  LogoutResponse,
  ValidateSessionRequest,
  ValidateSessionResponse,
  RefreshTokenRequest,
  TokenResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  BaseRequest,
} = authPbModule;

const { AuthServicePromiseClient } = authGrpcModule;
const GRPC_SERVER_URL = import.meta.env.VITE_GRPC_SERVER_URL || 'http://localhost:8080';

export class AuthGrpcService {
  private client: typeof AuthServicePromiseClient;

  constructor() {
    this.client = new AuthServicePromiseClient(GRPC_SERVER_URL);
  }

  private createBaseRequest(): BaseRequest {
    const baseRequest = new BaseRequest();
    baseRequest.setDownstream('web-client');
    baseRequest.setRequestId(crypto.randomUUID());
    return baseRequest;
  }

  async login(email: string, password: string): Promise<{
    success: boolean;
    message: string;
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    user?: any;
  }> {
    try {
      const request = new LoginRequest();
      request.setEmail(email);
      request.setPassword(password);
      request.setRequest(this.createBaseRequest());

      const response: LoginResponse = await this.client.login(request);

      // Store tokens if login successful
      if (response.getSuccess() && response.getAccessToken()) {
        setAuthToken(response.getAccessToken());
        if (response.getRefreshToken()) {
          setRefreshToken(response.getRefreshToken());
        }
      }

      return {
        success: response.getSuccess(),
        message: response.getMessage(),
        accessToken: response.getAccessToken(),
        refreshToken: response.getRefreshToken(),
        expiresIn: response.getExpiresIn(),
        user: response.getUser()?.toObject(),
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  }

  async register(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{
    success: boolean;
    message: string;
    user?: any;
  }> {
    try {
      const request = new RegisterRequest();
      request.setUsername(username);
      request.setEmail(email);
      request.setPassword(password);
      request.setConfirmPassword(confirmPassword);
      request.setRequest(this.createBaseRequest());

      const response: RegisterResponse = await this.client.register(request);

      return {
        success: response.getSuccess(),
        message: response.getMessage(),
        user: response.getUser()?.toObject(),
      };
    } catch (error) {
      console.error('Register error:', error);
      throw new Error('Registration failed');
    }
  }

  async logout(userId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const request = new LogoutRequest();
      request.setUserId(userId);
      request.setRequest(this.createBaseRequest());

      const response: LogoutResponse = await this.client.logout(request);

      return {
        success: response.getSuccess(),
        message: response.getMessage(),
      };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  }

  async validateSession(accessToken: string): Promise<{
    valid: boolean;
    userId?: string;
    email?: string;
    role?: string;
    expiresAt?: number;
  }> {
    try {
      const request = new ValidateSessionRequest();
      request.setAccessToken(accessToken);
      request.setRequest(this.createBaseRequest());

      const response: ValidateSessionResponse = await this.client.validateSession(request);

      return {
        valid: response.getValid(),
        userId: response.getUserId(),
        email: response.getEmail(),
        role: response.getRole(),
        expiresAt: response.getExpiresAt(),
      };
    } catch (error) {
      console.error('Session validation error:', error);
      return { valid: false };
    }
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const request = new UpdatePasswordRequest();
      request.setUserId(userId);
      request.setCurrentPassword(currentPassword);
      request.setNewPassword(newPassword);
      request.setRequest(this.createBaseRequest());

      const response: UpdatePasswordResponse = await this.client.updatePassword(request);

      return {
        success: response.getSuccess(),
        message: response.getMessage(),
      };
    } catch (error) {
      console.error('Update password error:', error);
      throw new Error('Password update failed');
    }
  }
}

export const authGrpcService = new AuthGrpcService();

// Token management functions
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', token);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
};

export const setRefreshToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('refresh_token', token);
};

export const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// SolidJS Query hooks
export const useGrpcLoginMutation = () => {
  return useMutation(() => ({
    mutationFn: async (params: { email: string; password: string; rememberMe?: boolean }) => {
      return authGrpcService.login(params.email, params.password);
    },
  }));
};

export const useGrpcRegisterMutation = () => {
  return useMutation(() => ({
    mutationFn: async (params: {
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      return authGrpcService.register(
        params.username,
        params.email,
        params.password,
        params.confirmPassword
      );
    },
  }));
};

export const useGrpcLogoutMutation = () => {
  return useMutation(() => ({
    mutationFn: async (userId: string) => {
      return authGrpcService.logout(userId);
    },
  }));
};

export const useGrpcUpdatePasswordMutation = () => {
  return useMutation(() => ({
    mutationFn: async (params: {
      userId: string;
      oldPassword: string;
      newPassword: string;
    }) => {
      return authGrpcService.updatePassword(
        params.userId,
        params.oldPassword,
        params.newPassword
      );
    },
  }));
};

export const useGrpcValidateSession = () => {
  return useQuery(() => ({
    queryKey: ['grpc', 'validateSession'],
    queryFn: async () => {
      const token = getAuthToken();
      if (!token) {
        return { valid: false };
      }
      return authGrpcService.validateSession(token);
    },
    get enabled() {
      return !!getAuthToken();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  }));
};