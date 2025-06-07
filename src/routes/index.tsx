// App.tsx - Main Landing Page Component
import { Component, createSignal, For } from 'solid-js';
import { A } from '@solidjs/router';
import { Button } from '@/ui/button';
import { TextField, TextFieldRoot } from '@/ui/textfield';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import {
    Search,
    TrendingUp,
    Users,
    Building2,
    DollarSign,
    ArrowRight,
    Menu,
    Globe,
    BarChart3,
    Target,
    Lightbulb
} from 'lucide-solid';

const CrunchbaseLanding: Component = () => {
    const [searchQuery, setSearchQuery] = createSignal('');
    const [isMenuOpen, setIsMenuOpen] = createSignal(false);

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

    const navigationItems = [
        { name: 'Solutions', href: '/solutions' },
        { name: 'Products', href: '/products' },
        { name: 'Resources', href: '/resources' },
        { name: 'Pricing', href: '/pricing' }
    ];

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

    return (
        <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
            {/* Navigation */}
            <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div class="flex items-center">
                            <A href="/" class="flex items-center space-x-2">
                                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Building2 class="w-5 h-5 text-white" />
                                </div>
                                <span class="text-xl font-bold text-gray-900">crunchbase</span>
                                <Badge variant="secondary" class="ml-2 bg-blue-100 text-blue-800">PRO</Badge>
                            </A>
                        </div>

                        {/* Desktop Navigation */}
                        <div class="hidden md:flex items-center space-x-8">
                            <For each={navigationItems}>
                                {(item) => (
                                    <A
                                        href={item.href}
                                        class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                    >
                                        {item.name}
                                    </A>
                                )}
                            </For>
                        </div>

                        {/* Action Buttons */}
                        <div class="hidden md:flex items-center space-x-4">
                            <Button variant="ghost" class="text-gray-700">
                                Log In
                            </Button>
                            <Button class="bg-blue-600 hover:bg-blue-700">
                                Start Free Trial
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            class="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen())}
                        >
                            <Menu class="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
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

            {/* Statistics Section */}
            <section class="py-16 bg-white/50 backdrop-blur-sm">
                <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-8">
                        <Badge class="bg-blue-100 text-blue-800 mb-4">This month on Crunchbase</Badge>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="text-center">
                            <div class="text-4xl font-bold text-gray-900 mb-2">12,109,471</div>
                            <div class="text-gray-600">new predictions</div>
                        </div>
                        <div class="text-center">
                            <div class="text-4xl font-bold text-gray-900 mb-2">41,004</div>
                            <div class="text-gray-600">new insights</div>
                        </div>
                        <div class="text-center">
                            <div class="text-4xl font-bold text-gray-900 mb-2">3,345</div>
                            <div class="text-gray-600">new funding rounds</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Section */}
            <section class="py-16 px-4 sm:px-6 lg:px-8">
                <div class="max-w-6xl mx-auto">
                    <div class="flex items-center justify-center space-x-8 mb-12">
                        <Button variant="ghost" class="text-blue-600 border-b-2 border-blue-600">
                            Trending
                        </Button>
                        <Button variant="ghost" class="text-gray-600">
                            <Badge class="bg-blue-600 text-white mr-2">NEW</Badge>
                            Insights
                        </Button>
                        <Button variant="ghost" class="text-gray-600">
                            <Badge class="bg-blue-600 text-white mr-2">NEW</Badge>
                            Predictions
                        </Button>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <For each={trendingCompanies}>
                            {(company) => (
                                <Card class="hover:shadow-lg transition-all duration-300 bg-white/70 backdrop-blur-sm border border-gray-200">
                                    <CardHeader class="pb-4">
                                        <div class="flex items-start space-x-4">
                                            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
                                                {company.logo}
                                            </div>
                                            <div class="flex-1">
                                                <div class="flex items-center space-x-2 mb-1">
                                                    <CardTitle class="text-lg font-semibold">{company.name}</CardTitle>
                                                    <Badge variant="secondary" class="text-xs">
                                                        {company.category}
                                                    </Badge>
                                                </div>
                                                <CardDescription class="text-gray-600">
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
                        <Button variant="outline" class="border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                            View All Trending <ArrowRight class="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section class="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
                <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 class="text-3xl font-bold text-white mb-6">
                        Ready to discover your next opportunity?
                    </h2>
                    <p class="text-xl text-blue-100 mb-8">
                        Join thousands of professionals who trust Crunchbase for market intelligence
                    </p>
                    <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Button size="lg" class="bg-white text-blue-600 hover:bg-gray-100">
                            Start Free Trial
                        </Button>
                        <Button size="lg" variant="outline" class="border-white text-white hover:bg-white hover:text-blue-600">
                            Talk With Sales
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer class="bg-gray-900 text-white py-12">
                <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div class="flex items-center space-x-2 mb-4">
                                <Building2 class="w-6 h-6" />
                                <span class="text-lg font-semibold">crunchbase</span>
                            </div>
                            <p class="text-gray-400 text-sm">
                                The platform for finding business opportunities
                            </p>
                        </div>

                        <div>
                            <h3 class="font-semibold mb-4">Products</h3>
                            <ul class="space-y-2 text-sm text-gray-400">
                                <li><a href="#" class="hover:text-white">Platform</a></li>
                                <li><a href="#" class="hover:text-white">Enterprise</a></li>
                                <li><a href="#" class="hover:text-white">API</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 class="font-semibold mb-4">Resources</h3>
                            <ul class="space-y-2 text-sm text-gray-400">
                                <li><a href="#" class="hover:text-white">Blog</a></li>
                                <li><a href="#" class="hover:text-white">Reports</a></li>
                                <li><a href="#" class="hover:text-white">Help Center</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 class="font-semibold mb-4">Company</h3>
                            <ul class="space-y-2 text-sm text-gray-400">
                                <li><a href="#" class="hover:text-white">About</a></li>
                                <li><a href="#" class="hover:text-white">Careers</a></li>
                                <li><a href="#" class="hover:text-white">Contact</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                        © 2025 Crunchbase Inc. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CrunchbaseLanding;