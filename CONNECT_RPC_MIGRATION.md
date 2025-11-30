# Connect RPC Migration Summary

This document summarizes the migration from REST to Connect RPC for authentication in the SolidStart frontend.

## What Was Changed

### 1. Dependencies Added
- `@connectrpc/connect-query@2.2.0` - Connect-Query integration with TanStack Query
- `@buf/loci_loci-proto.bufbuild_es` - Protobuf message types (explicitly added to fix resolution)

### 2. New Files Created

#### `src/lib/connect-transport.ts`
- Creates and exports the Connect transport configured with:
  - Base URL from `VITE_CONNECT_BASE_URL` environment variable
  - Authentication interceptor that adds Bearer token to all requests
  - Exports singleton `transport` instance

#### `src/lib/auth/tokens.ts`
- Extracted token management functions from `src/lib/api.ts`:
  - `getAuthToken()` - Get access token from storage
  - `getRefreshToken()` - Get refresh token from storage
  - `setAuthToken()` - Store tokens in localStorage or sessionStorage
  - `clearAuthToken()` - Clear all stored tokens
  - `isAuthenticated()` - Check if user has a token
- Added SSR safety checks (`typeof window === "undefined"`)

#### `src/lib/api/auth-connect.ts`
- New Connect RPC-based authentication hooks using Connect-Query:
  - `useValidateSession` - Validate session with access token
  - `useLoginMutation` - Login with email/password
  - `useRegisterMutation` - Register new user
  - `useLogoutMutation` - Logout with refresh token
  - `useUpdatePasswordMutation` - Change password
  - `useRefreshTokenMutation` - Manually refresh tokens
- Includes wrapper functions that maintain backward-compatible API

### 3. Modified Files

#### `src/app.tsx`
- Added `TransportProvider` from `@connectrpc/connect-query`
- Wrapped app with transport provider to make Connect transport available to all Connect-Query hooks
- Provider hierarchy: `QueryClientProvider` → `TransportProvider` → `ThemeProvider` → ...

#### `src/lib/api/auth.ts`
- Replaced implementation with re-exports from `auth-connect.ts`
- Maintains backward compatibility - existing code using these hooks doesn't need changes

## How It Works

### Message Creation
Connect RPC uses Protobuf messages instead of JSON objects. Messages are created using the `create()` function:

```typescript
import { create } from '@bufbuild/protobuf';
import { LoginRequestSchema } from '@buf/loci_loci-proto.bufbuild_es/proto/auth_pb.js';

const request = create(LoginRequestSchema, {
  email: 'user@example.com',
  password: 'password123',
});
```

### Field Naming
Protobuf uses camelCase for field names (not snake_case):
- `access_token` → `accessToken`
- `refresh_token` → `refreshToken`
- `user_id` → `userId`
- `session_id` → `sessionId`

### Type Safety
All request/response types are fully typed from the Protobuf definitions. TypeScript will catch:
- Missing required fields
- Wrong field types
- Typos in field names

### Authentication Flow
1. Transport interceptor adds `Authorization: Bearer ${token}` header to all requests
2. Login/Register mutations store tokens using `setAuthToken()`
3. ValidateSession query checks if stored token is valid
4. Logout mutation clears tokens using `clearAuthToken()`

## Testing Checklist

### 1. Basic Auth Flow
- [ ] User can register a new account
- [ ] User can login with email/password
- [ ] "Remember me" checkbox stores tokens in localStorage vs sessionStorage
- [ ] Session validation works on page load
- [ ] User can logout successfully
- [ ] Tokens are cleared after logout

### 2. Token Management
- [ ] Access tokens are sent with authenticated requests
- [ ] Token refresh works when access token expires (if implemented in backend)
- [ ] Refresh token is used correctly in logout

### 3. Error Handling
- [ ] Invalid credentials show appropriate error
- [ ] Network errors are handled gracefully
- [ ] Server errors (500, etc.) are displayed to user
- [ ] Connect RPC errors map to user-friendly messages

### 4. Password Management
- [ ] Change password mutation works (if backend implemented)
- [ ] Appropriate errors for wrong old password

## Known Issues & Notes

### 1. Legacy REST API Still Exists
The old REST-based `authAPI` object in `src/lib/api.ts` still exists and may be used by:
- `src/lib/api/shared.ts` line 91 - calls `authAPI.refreshToken()` for auto-refresh
- Other legacy code that directly imports from `src/lib/api.ts`

**Recommendation**: Gradually migrate these usages to the new Connect-based hooks.

### 2. Unimplemented Backend Methods
According to previous context, the backend returns `Unimplemented` for:
- `ChangePassword`
- `ChangeEmail`

These will throw errors until backend implementation is complete.

### 3. Auto Token Refresh
The `apiRequest` function in `src/lib/api/shared.ts` has automatic token refresh logic that still uses the REST-based `authAPI.refreshToken()`. This should be updated to use the Connect-based refresh mutation.

### 4. Response Shape Compatibility
The wrapper functions in `auth-connect.ts` transform Connect RPC responses to match the old REST API shape where needed (e.g., converting camelCase to snake_case for `useValidateSession`). This maintains backward compatibility.

## Next Steps

1. **Test thoroughly** - Run through all auth flows in development
2. **Update auto-refresh** - Migrate the automatic token refresh in `apiRequest` to use Connect RPC
3. **Migrate other services** - Use the same pattern to migrate POI, itinerary, and other services to Connect RPC
4. **Remove legacy code** - Once all usages are migrated, remove the old REST-based `authAPI` object
5. **Environment variables** - Ensure `VITE_CONNECT_BASE_URL` is set correctly for production deployment

## Debugging Tips

### Enable Logging
Add console.log to the transport interceptor to see all RPC calls:

```typescript
// In src/lib/connect-transport.ts
interceptors: [
  (next) => async (req) => {
    console.log('RPC Call:', req.method.name, req);
    const token = getAuthToken();
    if (token) {
      req.header.set("Authorization", `Bearer ${token}`);
    }
    const response = await next(req);
    console.log('RPC Response:', response);
    return response;
  },
],
```

### Check Network Tab
- Connect RPC calls use POST requests to endpoints like `/loci.auth.AuthService/Login`
- Content-Type is `application/json` (for Connect protocol)
- Response includes Connect-specific headers

### TypeScript Errors
If you see import errors for proto files, ensure:
1. `@buf/loci_loci-proto.bufbuild_es` is in package.json dependencies
2. Run `pnpm install` to ensure proper hoisting
3. Check that imports use `.js` extension even for TypeScript files

## Support

For issues or questions about this migration:
1. Check the Connect RPC docs: https://connectrpc.com/docs/web/getting-started
2. Check the Buf Schema Registry: https://buf.build/loci/loci-proto
3. Review the generated TypeScript files in `node_modules/@buf/loci_loci-proto.bufbuild_es/proto/`
