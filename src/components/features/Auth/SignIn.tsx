// SignIn.tsx
import { Button } from "@/ui/button";
import { TextField, TextFieldRoot } from "@/ui/textfield";
import { A, useNavigate } from "@solidjs/router";
import { Component, createSignal, Show } from "solid-js";
import { VsEye, VsEyeClosed } from "solid-icons/vs";
import AuthLayout from "@/components/layout/Auth";
import { useLoginMutation } from "@/lib/api/auth";
import { useAuth } from "@/contexts/AuthContext";

// Define the FormData interface
interface FormData {
    email: string;
    password: string;
}

type AuthMode = 'signin' | 'signup' | 'forgot';



const SignIn: Component<{ onSwitchMode?: (mode: AuthMode) => void }> = (props) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = createSignal<Partial<FormData>>({
        email: '',
        password: ''
    });
    const [error, setError] = createSignal<string>('');

    const [showPassword, setShowPassword] = createSignal(false);
    const [isLoading, setIsLoading] = createSignal(false);

    const loginMutation = useLoginMutation();

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const data = formData();

        // Validate form
        if (!data.email || !data.email || !data.password) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            await loginMutation.mutateAsync({
                email: data.email,
                password: data.password,
            });
            
            login(data.email, data.password);
            navigate('/');
        } catch (err: any) {
            setError(err?.message || 'Sign in failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div class="text-center mb-4 sm:mb-6">
                <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Welcome back</h1>
                <p class="text-gray-600 text-sm sm:text-base">Sign in to your Loci account</p>
            </div>

            <form onSubmit={handleSubmit} class="space-y-3 sm:space-y-4">
                <Show when={error()}>
                    <div class="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p class="text-red-600 text-sm">{error()}</p>
                    </div>
                </Show>
                <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Email address
                    </label>
                    <TextFieldRoot>
                        <TextField
                            type="email"
                            placeholder="Enter your email"
                            value={formData().email || ''}
                            onInput={(e) => setFormData(prev => ({ ...prev, email: e.currentTarget.value }))}
                            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                            required
                        />
                    </TextFieldRoot>
                </div>

                <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Password
                    </label>
                    <div class="relative">
                        <TextFieldRoot>
                            <TextField
                                type={showPassword() ? "text" : "password"}
                                placeholder="Enter your password"
                                value={formData().password || ''}
                                onInput={(e) => setFormData(prev => ({ ...prev, password: e.currentTarget.value }))}
                                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                                required
                            />
                        </TextFieldRoot>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword())}
                            class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword() ? <VsEyeClosed class="w-4 h-4 sm:w-5 sm:h-5" /> : <VsEye class="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" class="rounded border-gray-300" />
                        <span class="text-gray-600">Remember me</span>
                    </label>
                    <A href="/auth/forgot-password" class="text-blue-600 hover:underline">
                        Forgot password?
                    </A>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading()}
                    class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                >
                    {isLoading() ? 'Signing in...' : 'Sign in'}
                </Button>

                <div class="relative my-6">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-200"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="outline" class="py-2.5 sm:py-3 border-gray-200 hover:bg-gray-50 text-sm sm:text-base">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </Button>
                    <Button variant="outline" class="py-2.5 sm:py-3 border-gray-200 hover:bg-gray-50 text-sm sm:text-base">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.369-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.845-1.378l-.759 2.893c-.276 1.071-1.009 2.422-1.522 3.256 1.143.35 2.738.542 4.217.542 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                        </svg>
                        LinkedIn
                    </Button>
                </div>
            </form>

            <div class="text-center mt-4 sm:mt-6">
                <span class="text-gray-600 text-sm sm:text-base">Don't have an account? </span>
                <A href="/auth/signup" class="text-blue-600 hover:underline font-medium text-sm sm:text-base">
                    Sign up
                </A>
            </div>
        </AuthLayout>
    );
};

export default SignIn;