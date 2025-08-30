import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  onMount,
  JSX,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import { 
  useGrpcValidateSession,
  useGrpcLoginMutation,
  useGrpcRegisterMutation,
  useGrpcLogoutMutation,
  useGrpcUpdatePasswordMutation,
  getAuthToken,
  clearAuthToken,
} from "~/lib/api/auth-grpc";

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
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  retryAuth: () => Promise<void>;
}

const AuthGrpcContext = createContext<AuthContextType>();

export const useAuthGrpc = () => {
  const context = useContext(AuthGrpcContext);
  if (!context) {
    throw new Error("useAuthGrpc must be used within an AuthGrpcProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: JSX.Element;
}

export const AuthGrpcProvider = (props: AuthProviderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = createSignal<User | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);

  // grpc-web mutations
  const loginMutation = useGrpcLoginMutation();
  const registerMutation = useGrpcRegisterMutation();
  const logoutMutation = useGrpcLogoutMutation();
  const updatePasswordMutation = useGrpcUpdatePasswordMutation();

  // Session validation query
  const sessionQuery = useGrpcValidateSession();

  // Create derived user from session validation
  createEffect(() => {
    const sessionData = sessionQuery.data;
    if (sessionData?.valid) {
      // Create user object from session data (limited info from grpc validation)
      const userData: User = {
        id: sessionData.userId || '',
        email: sessionData.email || '',
        username: sessionData.email?.split('@')[0] || '', // fallback username
        is_active: true,
        role: sessionData.role || 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(userData);
    } else if (sessionQuery.error) {
      setUser(null);
    }
  });

  // Update loading state
  createEffect(() => {
    setIsLoading(
      sessionQuery.isLoading 
    );
  });

  const retryAuth = async () => {
    const token = getAuthToken();
    if (!token || user()) return;

    try {
      sessionQuery.refetch();
    } catch (error) {
      console.error("grpc-web auth retry failed:", error);
    }
  };

  const login = async (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => {
    try {
      const result = await loginMutation.mutateAsync({
        email,
        password,
        rememberMe,
      });

      if (result.success) {
        // User data will be updated through the session validation effect
        navigate("/"); // Navigate to home after successful login
      } else {
        throw new Error(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    try {
      const result = await registerMutation.mutateAsync({
        username,
        email,
        password,
        confirmPassword,
      });

      if (result.success) {
        // Registration successful, user can now login
        navigate("/auth/signin");
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const currentUser = user();
      if (currentUser?.id) {
        await logoutMutation.mutateAsync(currentUser.id);
      }
      
      setUser(null);
      clearAuthToken();
      navigate("/");
    } catch (error) {
      // Even if logout fails on server, clear client state
      console.error("Logout failed:", error);
      setUser(null);
      clearAuthToken();
      navigate("/");
    }
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const currentUser = user();
      if (!currentUser?.id) {
        throw new Error("User not authenticated");
      }

      const result = await updatePasswordMutation.mutateAsync({
        userId: currentUser.id,
        oldPassword,
        newPassword,
      });

      if (!result.success) {
        throw new Error(result.message || "Password update failed");
      }
    } catch (error) {
      console.error("Password update failed:", error);
      throw error;
    }
  };

  const isAuthenticated = () => !!user();

  return (
    <AuthGrpcContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updatePassword,
        retryAuth,
      }}
    >
      {props.children}
    </AuthGrpcContext.Provider>
  );
};