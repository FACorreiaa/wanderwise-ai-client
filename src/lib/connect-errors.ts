// Maps ConnectRPC errors to user-friendly messages so the UI can render
// consistent, branchable error states instead of raw failures.
// (errors.ts handles streaming/string errors; this handles typed RPC errors.)
import { ConnectError, Code } from "@connectrpc/connect";

export interface FriendlyError {
  code: Code | "unknown";
  title: string;
  message: string;
  /** True when re-authenticating is the likely fix. */
  needsAuth: boolean;
}

export function friendlyError(err: unknown): FriendlyError {
  const ce = ConnectError.from(err);
  switch (ce.code) {
    case Code.Unauthenticated:
      return {
        code: ce.code,
        title: "Sign in required",
        message: "Please sign in again to continue.",
        needsAuth: true,
      };
    case Code.PermissionDenied:
      return {
        code: ce.code,
        title: "Not allowed",
        message: "You don't have permission to do that.",
        needsAuth: false,
      };
    case Code.NotFound:
      return {
        code: ce.code,
        title: "Not found",
        message: "We couldn't find what you were looking for.",
        needsAuth: false,
      };
    case Code.AlreadyExists:
      return {
        code: ce.code,
        title: "Already exists",
        message: "That already exists.",
        needsAuth: false,
      };
    case Code.InvalidArgument:
      return {
        code: ce.code,
        title: "Invalid input",
        message: ce.rawMessage || "Please check your input and try again.",
        needsAuth: false,
      };
    case Code.ResourceExhausted:
      return {
        code: ce.code,
        title: "Slow down",
        message: "You've hit a rate limit. Please try again shortly.",
        needsAuth: false,
      };
    case Code.Unavailable:
      return {
        code: ce.code,
        title: "Service unavailable",
        message: "The service is temporarily unavailable. Please try again.",
        needsAuth: false,
      };
    default:
      return {
        code: ce.code ?? "unknown",
        title: "Something went wrong",
        message: ce.rawMessage || "An unexpected error occurred.",
        needsAuth: false,
      };
  }
}
