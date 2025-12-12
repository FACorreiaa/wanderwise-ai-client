import { Button } from "@/ui/button";
import { TextField, TextFieldRoot } from "@/ui/textfield";
import { A, useNavigate } from "@solidjs/router";
import { Component, createSignal, Show, For, createMemo } from "solid-js";
import AuthLayout from '../../layout/Auth'
import { FiCheck, FiX } from "solid-icons/fi";
import { VsEyeClosed, VsEye } from "solid-icons/vs";
import { useRegisterMutation } from "~/lib/api/auth";
import { useTheme } from "~/contexts/ThemeContext";

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    company: string;
}

const SignUp: Component = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
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
        } catch (err: unknown) {
            const error = err as { message?: string };
            let errorMessage = 'Registration failed. Please try again.';

            if (error?.message) {
                const lowerCaseMessage = error.message.toLowerCase();

                if (lowerCaseMessage.includes('failed to fetch')) {
                    errorMessage = 'Could not connect to the server. Please try again later.';
                } else if (lowerCaseMessage.includes('already exists')) {
                    errorMessage = 'An account with this email already exists. Please sign in instead.';
                } else if (lowerCaseMessage.includes('internal server error') || lowerCaseMessage.includes('nil pointer')) {
                    errorMessage = 'The server encountered an error. Please try again later.';
                } else if (lowerCaseMessage.includes('password')) {
                    // Clean up password validation errors
                    errorMessage = error.message.replace(/\[.*?\]\s*/, '');
                    errorMessage = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
                } else {
                    errorMessage = error.message.replace(/\[.*?\]\s*/, '');
                    errorMessage = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
                }
            }
            setError(errorMessage);
        }
    };

    const passwordRequirements = createMemo(() => [
        { text: 'At least 8 characters', met: (formData().password?.length || 0) >= 8 },
        { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData().password || '') },
        { text: 'Contains lowercase letter', met: /[a-z]/.test(formData().password || '') },
        { text: 'Contains number', met: /\d/.test(formData().password || '') },
        { text: 'Contains special character (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData().password || '') },
    ]);

    const labelClass = createMemo(() => isDark() ? "text-white" : "text-slate-900");
    const inputClass = createMemo(() => isDark()
        ? "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-slate-300/70 focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all text-sm sm:text-base backdrop-blur"
        : "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm sm:text-base");
    const helperTextClass = createMemo(() => isDark() ? "text-slate-200/85" : "text-slate-700");
    const linkClass = createMemo(() => isDark() ? "text-emerald-200 hover:text-emerald-100" : "text-emerald-700 hover:text-emerald-600");
    const errorClass = createMemo(() => isDark()
        ? "p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-red-100 backdrop-blur"
        : "p-3 rounded-lg bg-red-50 border border-red-200 text-red-700");
    const socialButtonClass = createMemo(() => isDark()
        ? "py-2.5 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/15 text-white hover:bg-white/10"
        : "py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-slate-200 text-slate-900 hover:bg-slate-50");

    return (
        <AuthLayout>
            <div class="text-left mb-6 space-y-2">
                <p class={`text-xs uppercase tracking-[0.2em] ${isDark() ? 'text-emerald-200' : 'text-emerald-700'}`}>Create account</p>
                <h1 class={`text-2xl sm:text-3xl font-bold tracking-tight leading-tight ${isDark() ? 'text-white' : 'text-slate-900'}`}>
                    Build your travel operating profile.
                </h1>
                <p class={`${helperTextClass()} text-sm sm:text-base`}>
                    Save itineraries, sync devices, and keep refining your taste graph.
                </p>
            </div>

            <form onSubmit={handleSubmit} class="space-y-3 sm:space-y-4">
                <div>
                    <label class={`block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 ${labelClass()}`}>
                        Username
                    </label>
                    <TextFieldRoot>
                        <TextField
                            type="text"
                            placeholder="John"
                            value={formData().username || ''}
                            onInput={(e) => setFormData(prev => ({ ...prev, username: e.currentTarget.value }))}
                            class={inputClass()}
                            required
                        />
                    </TextFieldRoot>
                </div>

                <div>
                    <label class={`block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 ${labelClass()}`}>
                        Work email
                    </label>
                    <TextFieldRoot>
                        <TextField
                            type="email"
                            placeholder="john@company.com"
                            value={formData().email || ''}
                            onInput={(e) => setFormData(prev => ({ ...prev, email: e.currentTarget.value }))}
                            class={inputClass()}
                            required
                        />
                    </TextFieldRoot>
                </div>

                <div>
                    <label class={`block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 ${labelClass()}`}>
                        Company <span class={`${isDark() ? 'text-slate-200/70' : 'text-slate-500'}`}>(optional)</span>
                    </label>
                    <TextFieldRoot>
                        <TextField
                            type="text"
                            placeholder="Acme Inc."
                            value={formData().company || ''}
                            onInput={(e) => setFormData(prev => ({ ...prev, company: e.currentTarget.value }))}
                            class={inputClass()}
                        />
                    </TextFieldRoot>
                </div>

                <div>
                    <label class={`block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 ${labelClass()}`}>
                        Password
                    </label>
                    <div class="relative">
                        <TextFieldRoot>
                            <TextField
                                type={showPassword() ? "text" : "password"}
                                placeholder="Create a strong password"
                                value={formData().password || ''}
                                onInput={(e) => setFormData(prev => ({ ...prev, password: e.currentTarget.value }))}
                                class={`${inputClass()} pr-10 sm:pr-12`}
                                required
                            />
                        </TextFieldRoot>

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword())}
                            class={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 ${isDark() ? 'text-slate-400 hover:text-emerald-200' : 'text-slate-500 hover:text-emerald-600'}`}
                        >
                            {showPassword() ? <VsEyeClosed class="w-4 h-4 sm:w-5 sm:h-5" /> : <VsEye class="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                    </div>

                    <label class={`block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 pt-2 ${labelClass()}`}>
                        Confirm Password
                    </label>
                    <div class="relative">
                        <TextFieldRoot>
                            <TextField
                                type={showPassword() ? "text" : "password"}
                                placeholder="Create a strong password"
                                value={formData().confirmPassword || ''}
                                onInput={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.currentTarget.value }))}
                                class={`${inputClass()} pr-10 sm:pr-12`}
                                required
                            />
                        </TextFieldRoot>

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword())}
                            class={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 ${isDark() ? 'text-slate-400 hover:text-emerald-200' : 'text-slate-500 hover:text-emerald-600'}`}
                        >
                            {showPassword() ? <VsEyeClosed class="w-4 h-4 sm:w-5 sm:h-5" /> : <VsEye class="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                    </div>



                    <Show when={formData().password}>
                        <div class="mt-3 space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <p class="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Password Requirements</p>
                            <For each={passwordRequirements()}>{req => (
                                <div class="flex items-center gap-2 text-xs">
                                    <div class={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${req.met
                                        ? 'bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700'
                                        : 'bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700'
                                        }`}>
                                        <Show when={req.met} fallback={
                                            <FiX class="w-2.5 h-2.5 text-red-500 dark:text-red-400" />
                                        }>
                                            <FiCheck class="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                                        </Show>
                                    </div>
                                    <span class={`transition-colors ${req.met
                                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                                        : 'text-red-500 dark:text-red-400'}`}>
                                        {req.text}
                                    </span>
                                </div>
                            )}</For>
                        </div>
                    </Show>
                </div>

                {/* Error message */}
                <Show when={error()}>
                    <div class={errorClass()}>
                        <p class="text-sm">{error()}</p>
                    </div>
                </Show>

                <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    class="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold shadow-[0_18px_50px_rgba(52,211,153,0.35)]"
                >
                    {registerMutation.isPending ? 'Creating account...' : 'Create account'}
                </Button>

                <div class="relative my-6">
                    <div class="absolute inset-0 flex items-center">
                        <div class={`w-full border-t ${isDark() ? 'border-white/10' : 'border-slate-200'}`} />
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class={`px-2 rounded-full backdrop-blur ${isDark() ? 'bg-white/5 text-slate-200/80' : 'bg-slate-100 text-slate-600'}`}>Or continue with</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="outline" class={socialButtonClass()}>
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </Button>
                    <Button variant="outline" class={socialButtonClass()}>
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.369-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.845-1.378l-.759 2.893c-.276 1.071-1.009 2.422-1.522 3.256 1.143.35 2.738.542 4.217.542 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                        </svg>
                        LinkedIn
                    </Button>
                </div>
            </form>

            <div class="text-center mt-4 sm:mt-6">
                <span class={`${helperTextClass()} text-sm sm:text-base`}>Already have an account? </span>
                <A
                    href="/auth/signin"
                    class={`${linkClass()} underline-offset-4 font-semibold text-sm sm:text-base`}
                >
                    Sign in
                </A>
            </div>
        </AuthLayout>
    );
};

export default SignUp;
