import { Button } from "@/ui/button";
import { TextField, TextFieldRoot } from "@/ui/textfield";
import { useNavigate } from "@solidjs/router";
import { FiCheck } from "solid-icons/fi";
import { Component, createSignal, Show } from "solid-js";
import AuthLayout from "../../layout/Auth";
import { useTheme } from "~/contexts/ThemeContext";
import { useForgotPasswordMutation } from "~/lib/api/auth-connect";

const ForgotPassword: Component = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [email, setEmail] = createSignal("");
  const [emailSent, setEmailSent] = createSignal(false);
  const [emailError, setEmailError] = createSignal("");

  const forgotPasswordMutation = useForgotPasswordMutation();

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    // Validate on submit
    if (!validateEmail(email())) {
      return;
    }

    try {
      await forgotPasswordMutation.mutateAsync({ email: email() });
      setEmailSent(true);
    } catch (error) {
      // Still show success to prevent email enumeration
      console.error("Forgot password request failed:", error);
      setEmailSent(true);
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
  const linkClass = isDark()
    ? "text-emerald-200 hover:text-emerald-100"
    : "text-emerald-700 hover:text-emerald-600";

  return (
    <AuthLayout showBackButton onBack={handleBackToSignIn}>
      <Show
        when={!emailSent()}
        fallback={
          <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-emerald-400/15 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200/40">
              <FiCheck class="w-8 h-8 text-emerald-200" />
            </div>
            <h1
              class={`text-2xl font-bold tracking-tight ${isDark() ? "text-white" : "text-slate-900"}`}
            >
              Check your email
            </h1>
            <p class={`${helperClass}`}>
              We've sent a password reset link to <br />
              <span class={`font-semibold ${isDark() ? "text-white" : "text-slate-900"}`}>
                {email()}
              </span>
            </p>
            <p class={`text-sm ${helperClass}`}>
              Didn't receive the email? Check spam or{" "}
              <button
                onClick={() => setEmailSent(false)}
                class={`${linkClass} underline-offset-4 font-semibold`}
              >
                try again
              </button>
            </p>
            <Button
              onClick={handleBackToSignIn}
              variant="outline"
              class="w-full py-3 bg-white/5 border border-white/15 text-white hover:bg-white/10"
            >
              Back to sign in
            </Button>
          </div>
        }
      >
        <div class="text-left mb-6 space-y-2">
          <p class="text-xs uppercase tracking-[0.2em] text-emerald-200">Reset access</p>
          <h1 class="text-2xl font-bold text-white tracking-tight">Send a reset link</h1>
          <p class={`${helperClass}`}>We only use your email to deliver the reset instructions.</p>
        </div>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class={`block text-sm font-semibold mb-2 ${labelClass}`}>Email address</label>
            <TextFieldRoot>
              <TextField
                type="email"
                placeholder="Enter your email"
                value={email()}
                onInput={(e) => {
                  setEmail(e.currentTarget.value);
                  if (emailError()) setEmailError(""); // Clear error on input
                }}
                class={`${inputClass} ${emailError() ? inputErrorClass : ""}`}
              />
            </TextFieldRoot>
            <Show when={emailError()}>
              <p class="mt-1.5 text-sm text-red-500 dark:text-red-400">{emailError()}</p>
            </Show>
          </div>

          <Button
            type="submit"
            disabled={forgotPasswordMutation.isPending}
            class="w-full py-3 font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-[0_18px_50px_rgba(52,211,153,0.35)]"
          >
            {forgotPasswordMutation.isPending ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </Show>
    </AuthLayout>
  );
};

export default ForgotPassword;
