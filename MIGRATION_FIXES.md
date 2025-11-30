# Connect RPC Migration - Issues Fixed

## Issue 1: Missing Export Errors

**Errors:**
```
Module '"@connectrpc/connect"' has no exported member 'createConnectTransport'.
Module '"@buf/loci_loci-proto.connectrpc_query-es/proto/auth-AuthService_connectquery.js"' has no exported member 'createAuthService'.
```

**Root Cause:**
- Old, unused file `src/lib/api/clientConfig.ts` had incorrect imports
- This file was from an earlier attempt and never cleaned up

**Fix:**
- Deleted `src/lib/api/clientConfig.ts` (not used anywhere)
- The correct transport is in `src/lib/connect-transport.ts`

## Issue 2: TypeScript Error in useValidateSession

**Error:**
```
Argument of type '() => ValidateSessionRequest | undefined' is not assignable to parameter of type 'unique symbol | MessageInit<ValidateSessionRequest> | undefined'.
```

**Root Cause:**
- Connect-Query's `useQuery` expects a static message input, not a function
- We were passing a function that conditionally returned a message

**Fix:**
- Import `skipToken` from `@connectrpc/connect-query`
- Use ternary operator to conditionally pass the message or `skipToken`:
  ```typescript
  const token = getAuthToken();

  return useConnectQuery(
    validateSession,
    token
      ? create(ValidateSessionRequestSchema, { sessionId: token })
      : skipToken,
    { /* options */ }
  );
  ```

## Final Status

✅ Build succeeds
✅ No TypeScript errors in Connect RPC files
✅ All imports resolve correctly
✅ Ready for testing

## Next Step

Run the dev server and test authentication:
```bash
pnpm dev
```

Then test:
1. Login with email/password
2. Registration
3. Session validation on page refresh
4. Logout
