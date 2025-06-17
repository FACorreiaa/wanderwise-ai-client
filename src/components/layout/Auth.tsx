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
        <div class="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
            <div class="w-full max-w-sm sm:max-w-md">
                <Show when={props.showBackButton}>
                    <button
                        onClick={props.onBack}
                        class="flex items-center gap-2 mb-4 sm:mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <FiArrowLeft class="w-4 h-4" />
                        <span class="text-sm font-medium">Back</span>
                    </button>
                </Show>

                {/* Logo/Brand - Mobile optimized */}
                <div class="text-center mb-6 sm:mb-8">
                    <div class="inline-flex items-center gap-2 mb-2">
                        <div class="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span class="text-white font-bold text-xs sm:text-sm">L</span>
                        </div>
                        <span class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Loci</span>
                    </div>
                </div>

                {/* Card - Mobile responsive padding */}
                <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-4 sm:p-6 md:p-8">
                    {props.children}
                </div>

                {/* Footer - Mobile optimized text */}
                <div class="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2 sm:px-0">
                    By continuing, you agree to our{' '}
                    <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout