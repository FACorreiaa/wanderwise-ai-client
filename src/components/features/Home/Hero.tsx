import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { TextField, TextFieldRoot } from '@/ui/textfield';
import { } from '@kobalte/core';
import { Search, BarChart3, Lightbulb, Target, TrendingUp } from 'lucide-solid';
import { Component, createSignal, For } from 'solid-js';


const features = [
    {
        icon: <BarChart3 class="w-6 h-6" />,
        title: 'Compare Airbnb and Vrbo',
        description: 'Detailed competitive analysis and market insights'
    },
    {
        icon: <Target class="w-6 h-6" />,
        title: 'Cybersecurity exits in the last 12 months',
        description: 'Track industry trends and exit activities'
    },
    {
        icon: <Lightbulb class="w-6 h-6" />,
        title: 'Find SaaS companies that are likely growing',
        description: 'Discover high-potential growth opportunities'
    },
    {
        icon: <TrendingUp class="w-6 h-6" />,
        title: 'Tech companies that are likely raising soon',
        description: 'Identify upcoming funding opportunities'
    }
];

const Hero: Component = () => {
    const [searchQuery, setSearchQuery] = createSignal('');

    return (
        <section class="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
                    Make better decisions,{' '}
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        faster
                    </span>
                </h1>

                <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                    Discover and act on private market activity with predictive company intelligence
                </p>

                {/* Search Bar */}
                <div class="max-w-2xl mx-auto mb-8">
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center">
                            <Search class="w-5 h-5 text-gray-400" />
                        </div>
                        <TextFieldRoot>
                            <TextField
                                type="text"
                                placeholder="Ask me about Crunchbase data"
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                                class="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 bg-white/70 backdrop-blur-sm"
                            />
                        </TextFieldRoot>
                    </div>
                </div>

                {/* Feature Tags */}
                <div class="flex flex-wrap justify-center gap-3 mb-12">
                    <For each={features}>
                        {(feature) => (
                            <Badge
                                variant="secondary"
                                class="px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-200 hover:bg-white transition-all cursor-pointer"
                            >
                                <div class="flex items-center space-x-2">
                                    {feature.icon}
                                    <span>{feature.title}</span>
                                </div>
                            </Badge>
                        )}
                    </For>
                </div>

                <div class="text-center mb-8">
                    <p class="text-gray-600 mb-4">Get the full experience.</p>
                    <Button size="lg" class="bg-orange-500 hover:bg-orange-600 text-white px-8">
                        See Plans
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Hero;