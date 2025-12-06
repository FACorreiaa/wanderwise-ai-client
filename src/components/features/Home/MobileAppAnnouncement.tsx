import { createSignal } from 'solid-js';
import { Card, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Smartphone, Apple } from "lucide-solid";
import WaitlistModal from '~/components/WaitlistModal';

export default function MobileAppAnnouncement() {
    const [isWaitlistOpen, setIsWaitlistOpen] = createSignal(false);

    return (
        <>
            <WaitlistModal 
                isOpen={isWaitlistOpen} 
                onClose={() => setIsWaitlistOpen(false)} 
            />
        <section class="w-full py-8 sm:py-12 relative overflow-hidden" aria-labelledby="mobile-app-heading">
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-transparent to-purple-500/10" aria-hidden="true" />
            <div class="container px-4 sm:px-6 lg:px-8 relative z-10">
                <Card class="max-w-4xl mx-auto glass-panel gradient-border border-0 shadow-2xl">
                    <CardContent class="p-6 sm:p-8 lg:p-10">
                        <div class="text-center space-y-4 sm:space-y-6">
                            {/* Icons */}
                            <div class="flex justify-center items-center gap-4 sm:gap-6">
                                <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg border border-white/30 dark:border-slate-700/60">
                                    <Apple class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg border border-white/30 dark:border-slate-700/60">
                                    <Smartphone class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                            </div>

                            {/* Badge */}
                            <div class="flex justify-center">
                                <Badge class="bg-[#0c7df2] text-white border border-white/20 dark:border-slate-800/60 shadow-[0_12px_32px_rgba(12,125,242,0.22)] px-3 py-1 text-sm font-medium">
                                    Coming Soon
                                </Badge>
                            </div>

                            {/* Heading */}
                            <h2 id="mobile-app-heading" class="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-500 via-emerald-400 to-blue-500 dark:from-cyan-400 dark:via-emerald-300 dark:to-blue-400 bg-clip-text text-transparent tracking-tight">
                                Loci Mobile Apps
                            </h2>

                            {/* Description */}
                            <p class="text-base sm:text-lg text-slate-600 dark:text-slate-200 max-w-2xl mx-auto leading-relaxed">
                                Experience Loci on the go! Our iOS and Android apps are launching soon with offline maps, 
                                push notifications for nearby recommendations, and seamless sync across all your devices.
                            </p>

                            {/* Features list */}
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 text-sm sm:text-base">
                                <div class="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200">
                                    <div class="w-2 h-2 bg-cyan-400 rounded-full" />
                                    <span>Offline Maps</span>
                                </div>
                                <div class="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200">
                                    <div class="w-2 h-2 bg-purple-400 rounded-full" />
                                    <span>Push Notifications</span>
                                </div>
                                <div class="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200">
                                    <div class="w-2 h-2 bg-emerald-400 rounded-full" />
                                    <span>Device Sync</span>
                                </div>
                            </div>

                            {/* Call to action */}
                            <div class="pt-4 sm:pt-6">
                                <p class="text-sm sm:text-base text-slate-500 dark:text-slate-300/80">
                                    Want to be notified when we launch? 
                                    <button 
                                        onClick={() => setIsWaitlistOpen(true)}
                                        class="ml-1 text-cyan-600 dark:text-cyan-300 hover:text-emerald-500 dark:hover:text-emerald-300 font-semibold underline transition-colors"
                                    >
                                        Join our waitlist
                                    </button>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
        </>
    );
}
