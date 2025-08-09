import { JSX } from "solid-js";
import { AuthProvider } from "./AuthContext";
import { AuthGrpcProvider } from "./AuthContextGrpc";

interface AuthProviderSwitchProps {
  children: JSX.Element;
}

export const AuthProviderSwitch = (props: AuthProviderSwitchProps) => {
  // Default to using gRPC auth
  const useGrpcAuth = import.meta.env.VITE_USE_GRPC_AUTH !== "false";

  if (useGrpcAuth) {
    return <AuthGrpcProvider>{props.children}</AuthGrpcProvider>;
  }

  return <AuthProvider>{props.children}</AuthProvider>;
};