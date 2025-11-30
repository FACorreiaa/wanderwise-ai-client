# Final Fix: Connect RPC for Solid.js

## The Problem

The initial approach used `@connectrpc/connect-query`, which is **React-specific** and not compatible with Solid.js. This caused:
- White page with "[object Object]" displayed
- React Query imports failing in a Solid.js app
- `TransportProvider` not working

## The Solution

Use **plain Connect client** (`@connectrpc/connect`) with **Solid Query** directly.

### Key Changes

1. **Removed React-specific packages**:
   - ❌ `@connectrpc/connect-query` (React only)
   - ❌ `TransportProvider` from app.tsx

2. **Used correct imports**:
   ```typescript
   // ✅ Correct - works with Solid.js
   import { createClient } from '@connectrpc/connect';
   import { createQuery, createMutation } from '@tanstack/solid-query';

   // ❌ Wrong - React only
   import { useQuery, useMutation } from '@connectrpc/connect-query';
   ```

3. **Manual integration with Solid Query**:
   ```typescript
   // Create Connect client
   const authClient = createClient(AuthService, transport);

   // Use Solid Query hooks
   export const useLoginMutation = () => {
     const queryClient = useQueryClient();

     return createMutation(() => ({
       mutationFn: async ({ email, password }) => {
         const request = create(LoginRequestSchema, { email, password });
         return await authClient.login(request);
       },
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: queryKeys.session });
       },
     }));
   };
   ```

## Files Modified

### `src/app.tsx`
- Removed `TransportProvider` (React-specific)
- Removed import of `@connectrpc/connect-query`
- Transport is now used directly in `src/lib/connect-transport.ts`

### `src/lib/api/auth-connect.ts`
- Changed from `@connectrpc/connect-query` to plain `@connectrpc/connect`
- Use `createClient` instead of `createPromiseClient`
- Use Solid Query's `createQuery` and `createMutation` directly
- Manual integration with queryClient for cache invalidation

### `src/lib/connect-transport.ts`
- Export transport directly (no provider needed)
- Used by createClient calls

## How It Works Now

```
┌─────────────────────────────────────────────┐
│  Solid Component                            │
│  uses: useLoginMutation()                   │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  auth-connect.ts                            │
│  createMutation(() => ({                    │
│    mutationFn: () => authClient.login()     │
│  }))                                        │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  createClient(AuthService, transport)       │
│  - Creates Protobuf messages                │
│  - Makes RPC calls via Connect protocol     │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  transport (from connect-transport.ts)      │
│  - Adds Authorization header                │
│  - Sends HTTP POST to server                │
└─────────────────────────────────────────────┘
```

## Testing

Start the dev server:
```bash
pnpm dev
```

The app should now:
- ✅ Load without white page
- ✅ Display the login form properly
- ✅ Handle authentication via Connect RPC
- ✅ Work with all Solid.js reactivity

## Important Notes

1. **Don't use Connect-Query** - It's React-only
2. **Use `createClient`** - Not `createPromiseClient` (different API version)
3. **Solid Query integration** - Manual but straightforward
4. **Transport is global** - Created once, reused by all clients

## Package Dependencies

Keep installed:
- ✅ `@connectrpc/connect` - Core Connect client
- ✅ `@connectrpc/connect-web` - Browser transport
- ✅ `@bufbuild/protobuf` - Protobuf message creation
- ✅ `@buf/loci_loci-proto.bufbuild_es` - Generated messages
- ✅ `@tanstack/solid-query` - Solid.js query library

Can remove:
- ❌ `@connectrpc/connect-query` - Not needed for Solid.js
