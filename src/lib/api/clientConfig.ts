import { createConnectTransport, ConnectError, Interceptor } from '@connectrpc/connect';
import { createAuthService } from '@buf/loci_loci-proto.connectrpc_query-es/proto/auth-AuthService_connectquery';
import { getAuthToken } from '~/lib/api';

// 1. Define the base URL for your gRPC-Web service
// This should match the server you are running (e.g., http://localhost:8080)
const API_BASE_URL = 'http://localhost:8080';

/**
 * Interceptor to inject the Authorization header with the access token.
 */
const authInterceptor: Interceptor = (next) => async (req) => {
    const token = getAuthToken(); // Get the current access token (assuming stored in localStorage/sessionStorage)

    if (token) {
        // Add the token to the request headers
        req.header.set('Authorization', `Bearer ${token}`);
    }

    return next(req);
};

// 2. Configure the Connect Transport (for gRPC-Web)
const transport = createConnectTransport({
    baseUrl: API_BASE_URL,
    // We use the authInterceptor for all requests
    interceptors: [authInterceptor],
});

// 3. Create the specialized client for the AuthService
// This client uses the transport and automatically handles message serialization
export const authServiceClient = createAuthService(transport);

// Helper function to extract friendly error message from ConnectError
export function getConnectErrorMessage(error: unknown): string {
    if (error instanceof ConnectError) {
        // ConnectError often contains details from the server's Go error (h.toConnectError)
        return error.message;
    }
    return 'An unknown error occurred.';
}