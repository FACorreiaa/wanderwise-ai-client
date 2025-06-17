import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { TrendingUp, ArrowRight } from "lucide-solid";
import { Component, For } from "solid-js";


// Mock trending companies data
const trendingCompanies = [
    {
        id: 1,
        name: 'LogicMonitor',
        description: 'LogicMonitor acquires Earth Fox Technologies',
        category: 'Leadership Hire',
        logo: '🔍',
        trend: 'up'
    },
    {
        id: 2,
        name: 'OpenAI',
        description: 'It is possible that OpenAI will grow beyond $100B valuation',
        category: 'Growth Prediction',
        logo: '🤖',
        trend: 'up'
    }
];

const TrendingComponent: Component = () => {
    return (
        <section class="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
            <div class="max-w-6xl mx-auto">
                <div class="flex items-center justify-center space-x-8 mb-12">
                    <Button variant="ghost" class="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400">
                        Trending
                    </Button>
                    <Button variant="ghost" class="text-gray-600 dark:text-gray-300">
                        <Badge class="bg-blue-600 dark:bg-blue-700 text-white mr-2">NEW</Badge>
                        Insights
                    </Button>
                    <Button variant="ghost" class="text-gray-600 dark:text-gray-300">
                        <Badge class="bg-blue-600 dark:bg-blue-700 text-white mr-2">NEW</Badge>
                        Predictions
                    </Button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <For each={trendingCompanies}>
                        {(company) => (
                            <Card class="hover:shadow-lg transition-all duration-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                                <CardHeader class="pb-4">
                                    <div class="flex items-start space-x-4">
                                        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
                                            {company.logo}
                                        </div>
                                        <div class="flex-1">
                                            <div class="flex items-center space-x-2 mb-1">
                                                <CardTitle class="text-lg font-semibold text-gray-900 dark:text-white">{company.name}</CardTitle>
                                                <Badge variant="secondary" class="text-xs">
                                                    {company.category}
                                                </Badge>
                                            </div>
                                            <CardDescription class="text-gray-600 dark:text-gray-300">
                                                {company.description}
                                            </CardDescription>
                                        </div>
                                        <TrendingUp class="w-5 h-5 text-green-500" />
                                    </div>
                                </CardHeader>
                            </Card>
                        )}
                    </For>
                </div>

                <div class="text-center mt-12">
                    <Button variant="outline" class="border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                        View All Trending <ArrowRight class="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default TrendingComponent;

