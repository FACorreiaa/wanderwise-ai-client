import { Component, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { FiArrowLeft, FiCheck } from 'solid-icons/fi';
import { useTheme } from '~/contexts/ThemeContext';

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
    const { isDark } = useTheme();
    const shellBg = isDark()
        ? "bg-gradient-to-br from-[#050915] via-[#0b1c36] to-[#030712]"
        : "bg-gradient-to-br from-[#f5f7fb] via-[#eef2ff] to-[#e8f4ff]";
    const cardBg = isDark()
        ? "bg-[#0c152c]/95 border border-white/12 text-white"
        : "bg-white border border-slate-200 text-slate-900";
    const cardShadow = isDark()
        ? "shadow-[0_30px_100px_rgba(3,7,18,0.65)]"
        : "shadow-[0_24px_80px_rgba(15,23,42,0.12)]";
    const accentPill = isDark()
        ? "bg-emerald-400/15 border border-emerald-300/30 text-emerald-100"
        : "bg-emerald-100 border border-emerald-200 text-emerald-700";
    const textSoft = isDark() ? "text-slate-200/80" : "text-slate-600";

    return (
        <div class={`min-h-screen relative overflow-hidden ${shellBg} ${isDark() ? 'text-white' : 'text-slate-900'}`}>
            <Show when={isDark()}>
                <div class="absolute inset-0 opacity-60">
                    <div class="domain-grid" aria-hidden="true" />
                    <div class="domain-veil" aria-hidden="true" />
                    <div class="domain-halo" aria-hidden="true" />
                </div>
            </Show>

            <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <div class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-center">
                    {/* Story column */}
                    <div class="hidden lg:block">
                        <div class={`rounded-3xl p-8 space-y-6 ${isDark() ? 'glass-panel gradient-border shadow-[0_35px_120px_rgba(3,7,18,0.55)]' : 'bg-white border border-slate-200 shadow-[0_25px_80px_rgba(15,23,42,0.12)]'}`}>
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-300/30 text-emerald-100 text-xs font-semibold uppercase tracking-[0.2em]">
                                Travel OS
                            </div>
                            <h1 class={`text-4xl font-extrabold leading-tight ${isDark() ? 'text-white' : 'text-slate-900'}`}>
                                Join the taste-aware planner.
                                <span class="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-emerald-500 to-blue-500">
                                    Itineraries, restaurants, hotels — aligned to you.
                                </span>
                            </h1>
                            <p class={`text-lg leading-relaxed ${isDark() ? 'text-slate-200/85' : 'text-slate-700'}`}>
                                Your profile learns coffee strength, walking pace, bedtime, and accessibility needs.
                                Every suggestion is annotated and ready for offline.
                            </p>
                            <div class="grid grid-cols-2 gap-3">
                                <For each={[
                                    "Two-click rebooks and live tweaks",
                                    "Accessibility and budget cues surfaced",
                                    "Save once, sync across devices",
                                    "Native iOS + Android coming soon",
                                ]}>{(item) => (
                                    <div class={`flex items-start gap-2 rounded-2xl p-3 ${isDark() ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-200'}`}>
                                        <FiCheck class={`w-4 h-4 ${isDark() ? 'text-emerald-300' : 'text-emerald-600'} mt-0.5`} />
                                        <span class={`text-sm ${isDark() ? 'text-slate-100' : 'text-slate-800'}`}>{item}</span>
                                    </div>
                                )}</For>
                            </div>
                            <div class={`text-sm ${isDark() ? 'text-slate-300/90' : 'text-slate-600'}`}>
                                No spam. Your data stays yours. Delete anytime in settings.
                            </div>
                        </div>
                    </div>

                    {/* Auth card */}
                    <div class="w-full max-w-xl mx-auto">
                        <Show when={props.showBackButton}>
                            <button
                                onClick={props.onBack}
                                class={`flex items-center gap-2 mb-4 sm:mb-6 ${isDark() ? 'text-slate-200 hover:text-emerald-200' : 'text-slate-700 hover:text-emerald-700'} transition-colors`}
                            >
                                <FiArrowLeft class="w-4 h-4" />
                                <span class="text-sm font-medium">Back</span>
                            </button>
                        </Show>

                        <div class={`rounded-3xl p-5 sm:p-6 lg:p-7 ${cardBg} ${cardShadow}`}>
                            <div class="flex items-center gap-2 mb-6">
                                <div class={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${isDark() ? 'bg-white/15 border border-white/30 text-white shadow-[0_14px_32px_rgba(12,125,242,0.32)]' : 'bg-emerald-50 border border-emerald-100 text-emerald-700 shadow-[0_12px_28px_rgba(16,185,129,0.25)]'} backdrop-blur flex items-center justify-center font-bold`}>
                                    L
                                </div>
                                <span class="text-lg sm:text-xl font-bold tracking-tight">Loci</span>
                                <span class={`text-xs px-2 py-1 rounded-full ml-auto ${accentPill}`}>
                                    Private beta
                                </span>
                            </div>

                            {props.children}
                        </div>

                        <div class={`text-center mt-4 sm:mt-6 text-xs sm:text-sm px-2 sm:px-0 ${textSoft}`}>
                            By continuing, you agree to our{" "}
                            <a href="#" class={`${isDark() ? 'text-emerald-200 hover:text-emerald-100' : 'text-emerald-700 hover:text-emerald-600'} underline-offset-4`}>Terms</a>
                            {" "}and{" "}
                            <a href="#" class={`${isDark() ? 'text-emerald-200 hover:text-emerald-100' : 'text-emerald-700 hover:text-emerald-600'} underline-offset-4`}>Privacy</a>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout
