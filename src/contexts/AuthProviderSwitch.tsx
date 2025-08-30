import { JSX } from "solid-js";
import { AuthGrpcProvider } from "./AuthContextGrpc";

interface AuthProviderSwitchProps {
  children: JSX.Element;
}

export const AuthProviderSwitch = (props: AuthProviderSwitchProps) => {
  return <AuthGrpcProvider>{props.children}</AuthGrpcProvider>;
};