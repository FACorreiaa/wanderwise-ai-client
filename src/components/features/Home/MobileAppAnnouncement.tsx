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
        <section class="w-full py-8 sm:py-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900" aria-labelledby="mobile-app-heading">
            <div class="container px-4 sm:px-6 lg:px-8">
                <Card class="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent class="p-6 sm:p-8 lg:p-10">
                        <div class="text-center space-y-4 sm:space-y-6">
                            {/* Icons */}
                            <div class="flex justify-center items-center gap-4 sm:gap-6">
                                <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Apple class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Smartphone class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                            </div>

                            {/* Badge */}
                            <div class="flex justify-center">
                                <Badge class="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700 px-3 py-1 text-sm font-medium">
                                    Coming Soon
                                </Badge>
                            </div>

                            {/* Heading */}
                            <h2 id="mobile-app-heading" class="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Loci Mobile Apps
                            </h2>

                            {/* Description */}
                            <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                                Experience Loci on the go! Our iOS and Android apps are launching soon with offline maps, 
                                push notifications for nearby recommendations, and seamless sync across all your devices.
                            </p>

                            {/* Features list */}
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 text-sm sm:text-base">
                                <div class="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
                                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Offline Maps</span>
                                </div>
                                <div class="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
                                    <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span>Push Notifications</span>
                                </div>
                                <div class="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
                                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Device Sync</span>
                                </div>
                            </div>

                            {/* Call to action */}
                            <div class="pt-4 sm:pt-6">
                                <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                    Want to be notified when we launch? 
                                    <button 
                                        onClick={() => setIsWaitlistOpen(true)}
                                        class="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline transition-colors"
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