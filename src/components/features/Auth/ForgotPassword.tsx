import { Button } from "@/ui/button";
import { TextField, TextFieldRoot } from "@/ui/textfield";
import { useNavigate } from "@solidjs/router";
import { FiCheck } from "solid-icons/fi";
import { Component, createSignal, Show } from "solid-js";
import AuthLayout from '../../layout/Auth'

type AuthMode = 'signin' | 'signup' | 'forgot';


const ForgotPassword: Component<{ onSwitchMode?: (mode: AuthMode) => void }> = (props) => {
    const navigate = useNavigate();
    const [email, setEmail] = createSignal('');
    const [isLoading, setIsLoading] = createSignal(false);
    const [emailSent, setEmailSent] = createSignal(false);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        setEmailSent(true);
    };

    const handleBackToSignIn = () => {
        navigate('/signin');
    };

    return (
        <AuthLayout showBackButton onBack={handleBackToSignIn}>
            <Show when={!emailSent()} fallback={
                <div class="text-center">
                    <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiCheck class="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Check your email</h1>
                    <p class="text-slate-600 dark:text-slate-300 mb-6">
                        We've sent a password reset link to <br />
                        <span class="font-medium">{email()}</span>
                    </p>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Didn't receive the email? Check your spam folder or{' '}
                        <button
                            onClick={() => setEmailSent(false)}
                            class="text-cyan-600 dark:text-cyan-300 hover:underline font-semibold"
                        >
                            try again
                        </button>
                    </p>
                    <Button
                        onClick={handleBackToSignIn}
                        variant="outline"
                        class="w-full py-3"
                    >
                        Back to sign in
                    </Button>
                </div>
            }>
                <div class="text-center mb-6">
                    <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Reset your password</h1>
                    <p class="text-slate-600 dark:text-slate-300">Enter your email address and we'll send you a link to reset your password</p>
                </div>

                <form onSubmit={handleSubmit} class="space-y-4">
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                            Email address
                        </label>
                        <TextFieldRoot>
                            <TextField
                                type="email"
                                placeholder="Enter your email"
                                value={email()}
                                onInput={(e) => setEmail(e.currentTarget.value)}
                                class="w-full px-4 py-3 rounded-lg border border-white/50 dark:border-slate-800/70 bg-white/40 dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all backdrop-blur"
                                required
                            />
                        </TextFieldRoot>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading()}
                        class="w-full py-3 font-semibold"
                    >
                        {isLoading() ? 'Sending...' : 'Send reset link'}
                    </Button>
                </form>
            </Show>
        </AuthLayout>
    );
};

export default ForgotPassword;
