import { Component, createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Button } from "@/ui/button";
import { TextField, TextFieldRoot } from "@/ui/textfield";
import { Badge } from "@/ui/badge";
import { VsEye, VsEyeClosed } from "solid-icons/vs";
import { FiArrowLeft, FiCheck } from 'solid-icons/fi';

// Types
type AuthMode = 'signin' | 'signup' | 'forgot';

interface AuthPagesProps {
    initialMode?: AuthMode;
}

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    company: string;
}

// Auth Layout Component
const AuthLayout: Component<{ children: any; showBackButton?: boolean; onBack?: () => void }> = (props) => {
    return (
        <div class="min-h-screen relative overflow-hidden flex items-center justify-center p-3 sm:p-4 md:p-6">
            <div class="absolute inset-0 bg-white/90 dark:bg-slate-950/85 backdrop-blur" aria-hidden="true" />
            <div class="pointer-events-none absolute inset-0 aurora-sheen opacity-60" aria-hidden="true" />

            <div class="w-full max-w-sm sm:max-w-md relative z-10">
                <Show when={props.showBackButton}>
                    <button
                        onClick={props.onBack}
                        class="flex items-center gap-2 mb-4 sm:mb-6 text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
                    >
                        <FiArrowLeft class="w-4 h-4" />
                        <span class="text-sm font-medium">Back</span>
                    </button>
                </Show>

                {/* Logo/Brand - Mobile optimized */}
                <div class="text-center mb-6 sm:mb-8">
                    <div class="inline-flex items-center gap-2 mb-2">
                        <div class="w-7 h-7 sm:w-8 sm:h-8 bg-[#0c7df2] rounded-lg flex items-center justify-center shadow-[0_12px_32px_rgba(12,125,242,0.22)]">
                            <span class="text-white font-bold text-xs sm:text-sm">L</span>
                        </div>
                        <span class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Loci</span>
                    </div>
                </div>

                {/* Card - Mobile responsive padding */}
                <div class="glass-panel gradient-border rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                    {props.children}
                </div>

                {/* Footer - Mobile optimized text */}
                <div class="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 px-2 sm:px-0">
                    By continuing, you agree to our{' '}
                    <a href="#" class="text-cyan-600 dark:text-cyan-300 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" class="text-cyan-600 dark:text-cyan-300 hover:underline">Privacy Policy</a>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout
