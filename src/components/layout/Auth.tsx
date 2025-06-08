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
        <div class="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white flex items-center justify-center p-4">
            <div class="w-full max-w-md">
                <Show when={props.showBackButton}>
                    <button
                        onClick={props.onBack}
                        class="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <FiArrowLeft class="w-4 h-4" />
                        <span class="text-sm font-medium">Back</span>
                    </button>
                </Show>

                {/* Logo/Brand */}
                <div class="text-center mb-8">
                    <div class="inline-flex items-center gap-2 mb-2">
                        <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span class="text-white font-bold text-sm">L</span>
                        </div>
                        <span class="text-xl font-bold text-gray-900">Loci</span>
                    </div>
                </div>

                {/* Card */}
                <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                    {props.children}
                </div>

                {/* Footer */}
                <div class="text-center mt-6 text-sm text-gray-500">
                    By continuing, you agree to our{' '}
                    <a href="#" class="text-blue-600 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" class="text-blue-600 hover:underline">Privacy Policy</a>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout