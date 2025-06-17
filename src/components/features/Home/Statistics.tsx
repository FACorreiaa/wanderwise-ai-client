import { Badge } from "@/ui/badge";
import { Component } from "solid-js";

const StatisticsComponent: Component = () => {
    return (
        <section class="py-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-8">
                    <Badge class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mb-4">This month on Loci</Badge>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="text-center">
                        <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">12,109,471</div>
                        <div class="text-gray-600 dark:text-gray-300">new predictions</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">41,004</div>
                        <div class="text-gray-600 dark:text-gray-300">new insights</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">3,345</div>
                        <div class="text-gray-600 dark:text-gray-300">new funding rounds</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StatisticsComponent;