// Authentication queries and mutations
import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { clearAuthToken, getAuthToken, getRefreshToken, setAuthToken } from '../api';
import { apiRequest, queryKeys } from './shared';

// =======================
// AUTHENTICATION QUERIES
// =======================

export const useValidateSession = () => {
  return useQuery(() => ({
    queryKey: queryKeys.session,
    queryFn: async () => {
      const token = getAuthToken();
      if (!token) return { valid: false };
      return apiRequest<{ valid: boolean; user_id?: string; username?: string; email?: string }>(
        'loci.auth.AuthService/ValidateSession',
        {
          method: 'POST',
          body: JSON.stringify({ session_id: token }),
        }
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  }));
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ email, password, rememberMe = false }: { email: string; password: string; rememberMe?: boolean }) =>
      apiRequest<{ access_token: string; refresh_token: string; message: string }>('loci.auth.AuthService/Login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    onSuccess: async (data, variables) => {
      setAuthToken(data.access_token, variables.rememberMe || false, data.refresh_token);
      queryClient.invalidateQueries({ queryKey: queryKeys.session });
    },
  }));
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: ({ username, email, password, role = 'user' }: {
      username: string;
      email: string;
      password: string;
      role?: string;
    }) =>
      apiRequest<{ message: string }>('loci.auth.AuthService/Register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, role }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.session });
    },
  }));
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available for logout');
      }
      return apiRequest<{ message: string }>('loci.auth.AuthService/Logout', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    },
    onSettled: async () => {
      clearAuthToken();
      queryClient.clear(); // Clear all cached data on logout
    },
  }));
};

export const useUpdatePasswordMutation = () => {
  return useMutation(() => ({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      apiRequest<{ message: string }>('loci.auth.AuthService/ChangePassword', {
        method: 'PUT',
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      }),
  }));
};
