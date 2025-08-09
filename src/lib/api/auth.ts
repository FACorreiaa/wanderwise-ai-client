// Authentication queries and mutations
import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';
import { apiRequest, queryKeys } from './shared';

//
//
// export const useValidateSession = () => {
//   return useQuery(() => ({
//     queryKey: queryKeys.session,
//     queryFn: () => apiRequest<{ valid: boolean }>('auth/validate-session'),
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     retry: false,
//   }));
// };
//
// export const useLoginMutation = () => {
//   const queryClient = useQueryClient();
//
//   return useMutation(() => ({
//     mutationFn: ({ email, password, rememberMe = false }: { email: string; password: string; rememberMe?: boolean }) =>
//       apiRequest<{ access_token: string; message: string }>('auth/login', {
//         method: 'POST',
//         body: JSON.stringify({ email, password }),
//       }),
//     onSuccess: async (data, variables) => {
//       // Store token based on rememberMe preference using shared utility
//       const { setAuthToken } = await import('../api');
//       setAuthToken(data.access_token, variables.rememberMe || false);
//       queryClient.invalidateQueries({ queryKey: queryKeys.session });
//     },
//   }));
// };
//
// export const useRegisterMutation = () => {
//   const queryClient = useQueryClient();
//
//   return useMutation(() => ({
//     mutationFn: ({ username, email, password, role = 'user' }: {
//       username: string;
//       email: string;
//       password: string;
//       role?: string;
//     }) =>
//       apiRequest<{ message: string }>('auth/register', {
//         method: 'POST',
//         body: JSON.stringify({ username, email, password, role }),
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: queryKeys.session });
//     },
//   }));
// };
//
// export const useLogoutMutation = () => {
//   const queryClient = useQueryClient();
//
//   return useMutation(() => ({
//     mutationFn: () => apiRequest<{ message: string }>('auth/logout', { method: 'POST' }),
//     onSettled: async () => {
//       const { clearAuthToken } = await import('../api');
//       clearAuthToken();
//       queryClient.clear(); // Clear all cached data on logout
//     },
//   }));
// };
//
// export const useUpdatePasswordMutation = () => {
//   return useMutation(() => ({
//     mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
//       apiRequest<{ message: string }>('auth/update-password', {
//         method: 'PUT',
//         body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
//       }),
//   }));
// };