import { createContext, useContext, createSignal, createEffect, onMount, JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { getAuthToken, getRefreshToken, setAuthToken, clearAuthToken, isPersistentSession } from '~/lib/auth/tokens';
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
    const useLocalStorage = isPersistentSession();
    console.log('AuthProvider: Token found?', !!token, 'Persistent?', useLocalStorage);

    if (!token) {
      console.log('AuthProvider: No token found');
      setUser(null);
      setIsLoading(false);
      console.log('AuthProvider: Initialization complete');
      return;
    }

    const loadUserProfile = async () => {
      console.log('AuthProvider: Restoring session by fetching user profile...');
      const userProfile = await authAPI.getCurrentUser();
      console.log('AuthProvider: User profile fetched:', userProfile);
      setUser(userProfile);
    };

    try {
      await loadUserProfile();
    } catch (error) {
      console.error('AuthProvider: Session restoration failed:', error);

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuthToken();
        setUser(null);
        setIsLoading(false);
        console.log('AuthProvider: Initialization complete');
        return;
      }

      try {
        console.log('AuthProvider: Attempting token refresh for session restoration...');
        const refreshed = await authAPI.refreshToken();
        setAuthToken(refreshed.access_token, useLocalStorage, refreshed.refresh_token || refreshToken);
        await loadUserProfile();
        console.log('AuthProvider: Session restored after token refresh');
      } catch (refreshError) {
        console.error('AuthProvider: Token refresh failed during restore:', refreshError);
        clearAuthToken();
        setUser(null);
      }
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
          // Token was set in another tab, fetch profile
          try {
            const userProfile = await authAPI.getCurrentUser();
            setUser(userProfile);
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
      console.log('AuthProvider: Login successful, response:', response);

      const { access_token, refresh_token, user_id, username, email: userEmail } = response;
      setAuthToken(access_token, rememberMe, refresh_token);

      // Build display name with proper fallbacks
      const displayName = username || userEmail?.split('@')[0] || email.split('@')[0];

      console.log('AuthProvider: Setting user with id:', user_id, 'username:', username, 'display_name:', displayName);
      setUser({
        id: user_id || '',
        email: userEmail || email,
        username: username || '',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role: 'user',
        firstname: '',
        lastname: '',
        display_name: displayName,
      });

      console.log('AuthProvider: User set, navigating...');
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
    await authAPI.updatePassword(oldPassword, newPassword);
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
    // eslint-disable-next-line solid/components-return-once
    return (
      <div class="min-h-screen flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated()) {
    // eslint-disable-next-line solid/components-return-once
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
    // eslint-disable-next-line solid/components-return-once
    return (
      <div class="min-h-screen flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return <>{props.children}</>;
};
