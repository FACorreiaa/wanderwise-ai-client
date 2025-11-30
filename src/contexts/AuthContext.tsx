import { createContext, useContext, createSignal, createEffect, onMount, JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { getAuthToken, setAuthToken, clearAuthToken } from '~/lib/auth/tokens';
import { authAPI } from '~/lib/api';

interface User {
  id: string;
  email: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  age?: number;
  city?: string;
  country?: string;
  about_you?: string;
  display_name?: string;
  profile_image_url?: string;
  is_active: boolean;
  email_verified_at?: string;
  last_login_at?: string;
  theme?: string;
  language?: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: () => User | null;
  isAuthenticated: () => boolean;
  isLoading: () => boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  retryAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: JSX.Element;
}

export const AuthProvider = (props: AuthProviderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = createSignal<User | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  
  // Add a retry function for auth restoration
  const retryAuth = async () => {
    const token = getAuthToken();
    if (!token || user()) return;
    
    try {
      const sessionResult = await authAPI.validateSession();
      if (sessionResult.valid) {
        const userProfile = await authAPI.getCurrentUser();
        setUser(userProfile);
      }
    } catch (error) {
      console.error('Auth retry failed:', error);
    }
  };

  // Check authentication status on mount
  onMount(async () => {
    console.log('AuthProvider: Initializing authentication state...');
    const token = getAuthToken();
    console.log('AuthProvider: Token found?', !!token);
    
    if (token) {
      try {
        console.log('AuthProvider: Validating session...');
        // Validate session and get user profile data
        const sessionResult = await authAPI.validateSession();
        console.log('AuthProvider: Session validation result:', sessionResult);
        
        if (sessionResult.valid) {
          console.log('AuthProvider: Session valid, fetching user profile...');
          // Fetch complete user profile from server
          const userProfile = await authAPI.getCurrentUser();
          console.log('AuthProvider: User profile fetched:', userProfile);
          setUser(userProfile);
        } else {
          console.log('AuthProvider: Session invalid, clearing token');
          clearAuthToken();
          setUser(null);
        }
      } catch (error) {
        console.error('AuthProvider: Session validation failed:', error);
        console.error('AuthProvider: Error details:', {
          message: (error as any)?.message,
          status: (error as any)?.status,
          name: (error as any)?.name
        });
        
        // Don't clear token on network errors - could be temporary
        if ((error as any)?.message === 'Unauthorized' || (error as any)?.status === 401) {
          console.log('AuthProvider: Unauthorized error, clearing token');
          clearAuthToken();
          setUser(null);
        } else {
          // Keep token but set user as null for retry
          console.log('AuthProvider: Network/other error, keeping token for retry');
          setUser(null);
        }
      }
    } else {
      console.log('AuthProvider: No token found');
      setUser(null);
    }
    setIsLoading(false);
    console.log('AuthProvider: Initialization complete');
  });

  // Listen for token changes to handle cross-tab authentication
  createEffect(() => {
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === null) {
        const token = getAuthToken();
        if (!token && user()) {
          // Token was cleared in another tab
          setUser(null);
          navigate('/auth/signin');
        } else if (token && !user()) {
          // Token was set in another tab
          try {
            const sessionResult = await authAPI.validateSession();
            if (sessionResult.valid) {
              const userProfile = await authAPI.getCurrentUser();
              setUser(userProfile);
            }
          } catch (error) {
            console.error('Cross-tab session validation failed:', error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  });

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('AuthProvider: Login attempt for:', email, 'Remember me:', rememberMe);
      // Authenticate with server and get access token
      const response = await authAPI.login(email, password);
      console.log('AuthProvider: Login successful, got token');
      const refreshToken = (response as any).refresh_token ?? (response as any).refreshToken;
      setAuthToken(response.access_token, rememberMe, refreshToken);
      console.log('AuthProvider: Token stored, verifying...');
      
      // Verify token was stored correctly
      const storedToken = getAuthToken();
      console.log('AuthProvider: Token verification:', !!storedToken);
      
      // Fetch complete user profile after successful login
      const userProfile = await authAPI.getCurrentUser();
      console.log('AuthProvider: User profile fetched:', userProfile);
      setUser(userProfile);
      
      setIsLoading(false);
      navigate('/');
    } catch (error) {
      console.error('AuthProvider: Login failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Register new user with server
      await authAPI.register(username, email, password);
      // After successful registration, automatically log in the user
      await login(email, password);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Call server logout endpoint to invalidate session
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local authentication state
      clearAuthToken();
      setUser(null);
      setIsLoading(false);
      navigate('/auth/signin');
    }
  };

  const updatePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      await authAPI.updatePassword(oldPassword, newPassword);
    } catch (error) {
      throw error;
    }
  };

  const isAuthenticated = () => !!user();

  const authValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updatePassword,
    retryAuth,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
interface ProtectedRouteProps {
  children: JSX.Element;
  fallback?: JSX.Element;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  createEffect(() => {
    if (!isLoading() && !isAuthenticated()) {
      navigate('/auth/signin', { replace: true });
    }
  });

  if (isLoading()) {
    return (
      <div class="min-h-screen flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return props.fallback || (
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p class="text-gray-600">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{props.children}</>;
};

// Public Route Component (redirects authenticated users)
interface PublicRouteProps {
  children: JSX.Element;
  redirectTo?: string;
}

export const PublicRoute = (props: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  createEffect(() => {
    if (!isLoading() && isAuthenticated()) {
      navigate(props.redirectTo || '/');
    }
  });

  if (isLoading()) {
    return (
      <div class="min-h-screen flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{props.children}</>;
};
