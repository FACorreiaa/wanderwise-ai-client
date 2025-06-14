import { Button } from "@/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/card";
import { TextField, TextFieldRoot, TextFieldLabel } from "@/ui/textfield";
import { useNavigate } from "@solidjs/router";

import { Mail, KeyRound, UserPlus, User } from "lucide-solid";
import { Component, createSignal, Show } from "solid-js";
import AuthLayout from '../../layout/Auth'
import { FiCheck } from "solid-icons/fi";
import { VsEyeClosed, VsEye } from "solid-icons/vs";
import { useRegisterMutation } from "~/lib/api/auth";

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    company: string;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

const SignUp: Component<{ onSwitchMode?: (mode: AuthMode) => void }> = (props) => {
    const navigate = useNavigate();
    const [formData, setFormData] = createSignal<Partial<FormData>>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        company: ''
    });
    const [showPassword, setShowPassword] = createSignal(false);
    const [error, setError] = createSignal<string>('');

    // Use the register mutation
    const registerMutation = useRegisterMutation();

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setError('');

        const data = formData();

        // Validate form
        if (!data.username || !data.email || !data.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (data.password !== data.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await registerMutation.mutateAsync({
                username: data.username,
                email: data.email,
                password: data.password,
            });

            // Success! Navigate to sign in page
            navigate('/auth/signin');
        } catch (err: any) {
            setError(err?.message || 'Registration failed. Please try again.');
        }
    };

    const handleSwitchToSignIn = () => {
        navigate('/signin');
    };

    const passwordRequirements = [
        { text: 'At least 8 characters', met: (formData().password?.length || 0) >= 8 },
        { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData().password || '') },
        { text: 'Contains number', met: /\d/.test(formData().password || '') },
    ];

    return (
        <AuthLayout>
            <div class="text-center mb-4 sm:mb-6">
                <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Create your account</h1>
                <p class="text-gray-600 text-sm sm:text-base">Start discovering personalized travel experiences</p>
            </div>

            <form onSubmit={handleSubmit} class="space-y-3 sm:space-y-4">
                <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Username
                    </label>
                    <TextFieldRoot>
                        <TextField
                            type="text"
                            placeholder="John"
                            value={formData().username || ''}
                            onInput={(e) => setFormData(prev => ({ ...prev, username: e.currentTarget.value }))}
                            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                            required
                        />
                    </TextFieldRoot>
                </div>

                <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Work email
                    </label>
                    <TextFieldRoot>
                        <TextField
                            type="email"
                            placeholder="john@company.com"
                            value={formData().email || ''}
                            onInput={(e) => setFormData(prev => ({ ...prev, email: e.currentTarget.value }))}
                            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                            required
                        />
                    </TextFieldRoot>
                </div>

                <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Company <span class="text-gray-400">(optional)</span>
                    </label>
                    <TextFieldRoot>
                        <TextField
                            type="text"
                            placeholder="Acme Inc."
                            value={formData().company || ''}
                            onInput={(e) => setFormData(prev => ({ ...prev, company: e.currentTarget.value }))}
                            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
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
                                placeholder="Create a strong password"
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

                    <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 pt-2">
                        Confirm Password
                    </label>
                    <div class="relative">
                        <TextFieldRoot>
                            <TextField
                                type={showPassword() ? "text" : "password"}
                                placeholder="Create a strong password"
                                value={formData().confirmPassword || ''}
                                onInput={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.currentTarget.value }))}
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



                    <Show when={formData().password}>
                        <div class="mt-2 space-y-1">
                            {passwordRequirements.map(req => (
                                <div class="flex items-center gap-2 text-xs">
                                    <div class={`w-3 h-3 rounded-full flex items-center justify-center ${req.met ? 'bg-green-100' : 'bg-gray-100'
                                        }`}>
                                        <Show when={req.met}>
                                            <FiCheck class="w-2 h-2 text-green-600" />
                                        </Show>
                                    </div>
                                    <span class={req.met ? 'text-green-600' : 'text-gray-500'}>{req.text}</span>
                                </div>
                            ))}
                        </div>
                    </Show>
                </div>

                {/* Error message */}
                <Show when={error()}>
                    <div class="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p class="text-red-600 text-sm">{error()}</p>
                    </div>
                </Show>

                <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                >
                    {registerMutation.isPending ? 'Creating account...' : 'Create account'}
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
                <span class="text-gray-600 text-sm sm:text-base">Already have an account? </span>
                <button
                    onClick={handleSwitchToSignIn}
                    class="text-blue-600 hover:underline font-medium text-sm sm:text-base"
                >
                    Sign in
                </button>
            </div>
        </AuthLayout>
    );
};

export default SignUp;