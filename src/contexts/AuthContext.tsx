import { createContext, useContext, createSignal, createEffect, onMount, JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { authAPI, getAuthToken, setAuthToken, clearAuthToken } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

interface AuthContextType {
  user: () => User | null;
  isAuthenticated: () => boolean;
  isLoading: () => boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
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

  // Check authentication status on mount
  onMount(async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const result = await authAPI.validateSession();
        if (result.valid) {
          // If we have a valid session, we'd typically get user info here
          // For now, we'll set a mock user based on the token
          setUser({
            id: 'user-1',
            username: 'Current User',
            email: 'user@example.com',
            role: 'user',
            created_at: new Date().toISOString()
          });
        } else {
          clearAuthToken();
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        clearAuthToken();
      }
    }
    setIsLoading(false);
  });

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      setAuthToken(response.access_token);
      
      // Set user info (in a real app, this would come from the API response)
      setUser({
        id: 'user-1',
        username: email.split('@')[0],
        email,
        role: 'user',
        created_at: new Date().toISOString()
      });
      
      navigate('/');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      await authAPI.register(username, email, password);
      // After successful registration, log in the user
      await login(email, password);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
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
      navigate('/auth/signin');
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