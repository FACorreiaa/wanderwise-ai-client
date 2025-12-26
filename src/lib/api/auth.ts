// Authentication queries and mutations using Connect RPC
// Re-export from auth-connect.ts
export {
  useValidateSession,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdatePasswordMutation,
  useRefreshTokenMutation,
} from "./auth-connect";
