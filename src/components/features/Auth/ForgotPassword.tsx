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
                    <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiCheck class="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h1>
                    <p class="text-gray-600 dark:text-gray-300 mb-6">
                        We've sent a password reset link to <br />
                        <span class="font-medium">{email()}</span>
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Didn't receive the email? Check your spam folder or{' '}
                        <button
                            onClick={() => setEmailSent(false)}
                            class="text-blue-600 dark:text-blue-400 hover:underline"
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
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reset your password</h1>
                    <p class="text-gray-600 dark:text-gray-300">Enter your email address and we'll send you a link to reset your password</p>
                </div>

                <form onSubmit={handleSubmit} class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email address
                        </label>
                        <TextFieldRoot>
                            <TextField
                                type="email"
                                placeholder="Enter your email"
                                value={email()}
                                onInput={(e) => setEmail(e.currentTarget.value)}
                                class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </TextFieldRoot>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading()}
                        class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                    >
                        {isLoading() ? 'Sending...' : 'Send reset link'}
                    </Button>
                </form>
            </Show>
        </AuthLayout>
    );
};

export default ForgotPassword;