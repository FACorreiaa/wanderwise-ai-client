import { Button } from "@/ui/button";
import { TextField, TextFieldRoot } from "@/ui/textfield";
import { useNavigate } from "@solidjs/router";
import { FiCheck } from "solid-icons/fi";
import { Component, createSignal, Show } from "solid-js";
import AuthLayout from "../../layout/Auth";
import { useForgotPasswordMutation } from "~/lib/api/auth-connect";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all";
const inputErrorClass = "!border-destructive !ring-destructive focus:!ring-destructive focus:!border-destructive";

const ForgotPassword: Component = () => {
  const navigate = useNavigate();
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

    if (!validateEmail(email())) {
      return;
    }

    try {
      await forgotPasswordMutation.mutateAsync({ email: email() });
      setEmailSent(true);
    } catch (error) {
      console.error("Forgot password request failed:", error);
      setEmailSent(true);
    }
  };

  const handleBackToSignIn = () => {
    navigate("/auth/signin");
  };

  return (
    <AuthLayout showBackButton onBack={handleBackToSignIn}>
      <Show
        when={!emailSent()}
        fallback={
          <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center mx-auto border border-primary/30">
              <FiCheck class="w-8 h-8 text-primary" />
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-foreground">Check your email</h1>
            <p class="text-muted-foreground">
              We've sent a password reset link to <br />
              <span class="font-semibold text-foreground">{email()}</span>
            </p>
            <p class="text-sm text-muted-foreground">
              Didn't receive the email? Check spam or{" "}
              <button
                onClick={() => setEmailSent(false)}
                class="text-primary hover:text-primary/80 underline-offset-4 font-semibold"
              >
                try again
              </button>
            </p>
            <Button
              onClick={handleBackToSignIn}
              variant="outline"
              class="w-full py-3 border-border bg-card text-foreground hover:bg-muted"
            >
              Back to sign in
            </Button>
          </div>
        }
      >
        <div class="text-left mb-6 space-y-2">
          <p class="text-xs uppercase tracking-[0.2em] text-primary">Reset access</p>
          <h1 class="text-2xl font-bold text-foreground tracking-tight">Send a reset link</h1>
          <p class="text-muted-foreground">We only use your email to deliver the reset instructions.</p>
        </div>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2 text-foreground">Email address</label>
            <TextFieldRoot>
              <TextField
                type="email"
                placeholder="Enter your email"
                value={email()}
                onInput={(e) => {
                  setEmail(e.currentTarget.value);
                  if (emailError()) setEmailError("");
                }}
                class={`${inputClass} ${emailError() ? inputErrorClass : ""}`}
              />
            </TextFieldRoot>
            <Show when={emailError()}>
              <p class="mt-1.5 text-sm text-destructive">{emailError()}</p>
            </Show>
          </div>

          <Button
            type="submit"
            disabled={forgotPasswordMutation.isPending}
            class="w-full py-3 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            {forgotPasswordMutation.isPending ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </Show>
    </AuthLayout>
  );
};

export default ForgotPassword;