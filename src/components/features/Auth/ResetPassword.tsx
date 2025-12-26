import { Button } from "@/ui/button";
import { TextField, TextFieldRoot } from "@/ui/textfield";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { FiCheck, FiLock } from "solid-icons/fi";
import { Component, createSignal, Show, onMount } from "solid-js";
import AuthLayout from "../../layout/Auth";
import { useTheme } from "~/contexts/ThemeContext";
import { useResetPasswordMutation } from "~/lib/api/auth-connect";

const ResetPassword: Component = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDark } = useTheme();
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [passwordReset, setPasswordReset] = createSignal(false);
  const [passwordError, setPasswordError] = createSignal("");
  const [confirmError, setConfirmError] = createSignal("");
  const [generalError, setGeneralError] = createSignal("");

  const resetPasswordMutation = useResetPasswordMutation();

  // Get token from URL - ensure it's always a string
  const token = (): string => {
    const t = searchParams.token;
    if (!t) return "";
    return Array.isArray(t) ? t[0] : String(t);
  };

  onMount(() => {
    if (!token()) {
      setGeneralError("Invalid or missing reset token");
    }
  });

  const validatePassword = (pwd: string): boolean => {
    if (!pwd.trim()) {
      setPasswordError("Password is required");
      return false;
    }
    if (pwd.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    // Check for uppercase, lowercase, digit, special char
    if (!/[A-Z]/.test(pwd)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(pwd)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(pwd)) {
      setPasswordError("Password must contain at least one digit");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      setPasswordError("Password must contain at least one special character");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (): boolean => {
    if (password() !== confirmPassword()) {
      setConfirmError("Passwords do not match");
      return false;
    }
    setConfirmError("");
    return true;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setGeneralError("");

    if (!token()) {
      setGeneralError("Invalid or missing reset token");
      return;
    }

    // Validate both fields
    const pwdValid = validatePassword(password());
    const confirmValid = validateConfirmPassword();

    if (!pwdValid || !confirmValid) {
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token: token(),
        newPassword: password(),
      });
      setPasswordReset(true);
    } catch (error: unknown) {
      console.error("Reset password failed:", error);
      const errorMsg = error instanceof Error ? error.message : "Failed to reset password";
      setGeneralError(errorMsg);
    }
  };

  const handleBackToSignIn = () => {
    navigate("/auth/signin");
  };

  const labelClass = isDark() ? "text-white" : "text-slate-900";
  const inputClass = isDark()
    ? "w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-slate-300/70 focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all backdrop-blur"
    : "w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all";
  const inputErrorClass = "!border-red-500 !ring-red-500 focus:!ring-red-500 focus:!border-red-500";
  const helperClass = isDark() ? "text-slate-200/85" : "text-slate-700";

  return (
    <AuthLayout showBackButton onBack={handleBackToSignIn}>
      <Show
        when={!passwordReset()}
        fallback={
          <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-emerald-400/15 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200/40">
              <FiCheck class="w-8 h-8 text-emerald-200" />
            </div>
            <h1
              class={`text-2xl font-bold tracking-tight ${isDark() ? "text-white" : "text-slate-900"}`}
            >
              Password reset!
            </h1>
            <p class={`${helperClass}`}>
              Your password has been successfully reset.
              <br />
              You can now sign in with your new password.
            </p>
            <Button
              onClick={handleBackToSignIn}
              class="w-full py-3 font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-[0_18px_50px_rgba(52,211,153,0.35)]"
            >
              Sign in
            </Button>
          </div>
        }
      >
        <div class="text-left mb-6 space-y-2">
          <div class="flex items-center gap-2 mb-2">
            <FiLock class="w-5 h-5 text-emerald-200" />
            <p class="text-xs uppercase tracking-[0.2em] text-emerald-200">Secure reset</p>
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Create new password</h1>
          <p class={`${helperClass}`}>Enter your new password below.</p>
        </div>

        <Show when={generalError()}>
          <div class="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p class="text-sm text-red-400">{generalError()}</p>
          </div>
        </Show>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class={`block text-sm font-semibold mb-2 ${labelClass}`}>New password</label>
            <TextFieldRoot>
              <TextField
                type="password"
                placeholder="Enter new password"
                value={password()}
                onInput={(e) => {
                  setPassword(e.currentTarget.value);
                  if (passwordError()) setPasswordError("");
                }}
                class={`${inputClass} ${passwordError() ? inputErrorClass : ""}`}
              />
            </TextFieldRoot>
            <Show when={passwordError()}>
              <p class="mt-1.5 text-sm text-red-500 dark:text-red-400">{passwordError()}</p>
            </Show>
          </div>

          <div>
            <label class={`block text-sm font-semibold mb-2 ${labelClass}`}>Confirm password</label>
            <TextFieldRoot>
              <TextField
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword()}
                onInput={(e) => {
                  setConfirmPassword(e.currentTarget.value);
                  if (confirmError()) setConfirmError("");
                }}
                class={`${inputClass} ${confirmError() ? inputErrorClass : ""}`}
              />
            </TextFieldRoot>
            <Show when={confirmError()}>
              <p class="mt-1.5 text-sm text-red-500 dark:text-red-400">{confirmError()}</p>
            </Show>
          </div>

          <p class={`text-xs ${helperClass}`}>
            Password must be at least 8 characters with uppercase, lowercase, digit, and special
            character.
          </p>

          <Button
            type="submit"
            disabled={resetPasswordMutation.isPending || !token()}
            class="w-full py-3 font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-[0_18px_50px_rgba(52,211,153,0.35)]"
          >
            {resetPasswordMutation.isPending ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      </Show>
    </AuthLayout>
  );
};

export default ResetPassword;
