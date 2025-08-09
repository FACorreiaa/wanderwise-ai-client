# grpc-web Authentication Implementation

This document describes the grpc-web authentication implementation for the SolidStart client.

## Overview

The authentication system now supports both REST API and grpc-web protocols. The implementation allows switching between the two modes via environment variable configuration.

## File Structure

```
src/
├── lib/
│   ├── grpc/
│   │   ├── generated/           # Generated grpc-web client code
│   │   │   ├── AuthServiceClientPb.ts
│   │   │   ├── auth_pb.d.ts
│   │   │   ├── auth_pb.js
│   │   │   ├── common_pb.d.ts
│   │   │   └── common_pb.js
│   │   └── auth-client.ts       # grpc-web auth client wrapper
│   └── api/
│       └── auth-grpc.ts         # grpc-web auth hooks
├── contexts/
│   ├── AuthContext.tsx          # Original REST auth context
│   ├── AuthContextGrpc.tsx      # New grpc-web auth context
│   └── AuthProviderSwitch.tsx   # Conditional provider
└── scripts/
    └── generate-grpc.sh         # Code generation script
```

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# API Configuration (REST API port)
VITE_API_BASE_URL=http://localhost:8081/api/v1

# grpc-web Configuration (Envoy proxy port)
VITE_GRPC_WEB_URL=http://localhost:8080

# Feature Flags
VITE_USE_GRPC_AUTH=false  # Set to true to use grpc-web auth
```

### Running with grpc-web

```bash
# Development with grpc-web auth
pnpm run dev:grpc

# Or set environment variable manually
VITE_USE_GRPC_AUTH=true pnpm run dev
```

## Implementation Details

### 1. Proto Code Generation

Two approaches are available for code generation:

#### Option A: TypeScript Types (Recommended)
```bash
./scripts/generate-ts-proto.sh
```
- Uses `ts-proto` to generate clean TypeScript interfaces
- Outputs to `src/lib/grpc/types/`
- Provides excellent type safety

#### Option B: Standard grpc-web
```bash  
./scripts/generate-grpc.sh
```
- Uses standard `protoc-gen-grpc-web` plugin
- Generates both TypeScript definitions and JavaScript
- May have module compatibility issues in modern environments

### 2. grpc-web Client Implementation

`src/lib/grpc/auth-client-simple.ts` provides a simple grpc-web client using fetch API:

```typescript
import { grpcAuthClient } from '~/lib/grpc/auth-client-simple';

// Usage
const response = await grpcAuthClient.login({ email, password });
```

This approach:
- Uses clean TypeScript interfaces from ts-proto
- Implements grpc-web protocol over HTTP/JSON
- Avoids module compatibility issues
- Provides the same API as standard grpc-web clients

### 3. SolidJS Integration

`src/lib/api/auth-grpc.ts` provides SolidJS Query hooks:

```typescript
import { useGrpcLoginMutation } from '~/lib/api/auth-grpc';

const loginMutation = useGrpcLoginMutation();
```

### 4. Context Switch

The `AuthProviderSwitch` component conditionally uses the appropriate auth provider based on the `VITE_USE_GRPC_AUTH` environment variable.

## Available Auth Methods

All standard authentication methods are supported via grpc-web:

- `login(email, password, rememberMe)` - User login
- `register(username, email, password, confirmPassword)` - User registration  
- `logout(userId)` - User logout
- `validateSession(token)` - Session validation
- `updatePassword(userId, currentPassword, newPassword)` - Password update
- `refreshToken(refreshToken)` - Token refresh
- `googleLogin(redirectUri)` - Google OAuth initiation
- `googleCallback(code, state)` - Google OAuth callback

## Server Requirements

The complete setup requires:

1. **grpc Server**: Implements auth.proto service definition (port 9000)
2. **Envoy Proxy**: Translates grpc-web ↔ grpc (port 8080)
3. **HTTP Server**: REST API fallback (port 8081)

### Architecture
```
Browser (grpc-web) → Envoy Proxy (8080) → grpc Server (9000)
Browser (REST)     → HTTP Server (8081)
```

### Docker Setup
The server includes `envoy.yaml` configuration and docker-compose setup:

```bash
# Start the complete stack
cd go-ai-poi-server
docker-compose up -d

# This starts:
# - PostgreSQL (5454)
# - Go grpc server (9000)  
# - Go HTTP server (8081)
# - Envoy proxy (8080)
# - Observability stack (Grafana, Prometheus, etc.)
```

## Development Workflow

1. **Start the grpc server** (ensure it's running on port 8080 or configured port)
2. **Generate client code** if proto files change:
   ```bash
   ./scripts/generate-grpc.sh
   ```
3. **Run client with grpc-web**:
   ```bash
   pnpm run dev:grpc
   ```
4. **Test authentication flows** using the same UI components

## Migration Path

The implementation maintains backward compatibility:

- Default behavior uses REST API (`VITE_USE_GRPC_AUTH=false`)
- Set `VITE_USE_GRPC_AUTH=true` to enable grpc-web
- All existing components work with both implementations
- Token storage and session management remain consistent

## Troubleshooting

### Common Issues

1. **grpc server not running**: Ensure the grpc server is running on the configured port
2. **CORS errors**: Configure the grpc server to handle web requests with appropriate CORS headers
3. **Proto changes**: Re-run `./scripts/generate-grpc.sh` after proto file updates
4. **Environment variables**: Check that `.env` file is properly configured

### Debugging

Enable debug logging by checking the browser console for grpc-web specific errors. The auth client wrapper logs all errors with context.

## Next Steps

1. Test all authentication flows with grpc-web enabled
2. Implement additional services (POIs, chat, etc.) using the same pattern
3. Consider performance optimizations (connection pooling, request batching)
4. Add error handling for network failures and timeouts