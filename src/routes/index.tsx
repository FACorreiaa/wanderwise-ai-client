import {
    useQuery,
} from '@tanstack/solid-query'
import { Button } from "@/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { TextField, TextFieldRoot } from "@/ui/textfield";

const fetchInsights = async () => {
    return [
        { title: "Leadership Hire", subtitle: "LogicMonitor appoints Gareth Fort" },
        { title: "Growth Prediction", subtitle: "It is likely that OpenAI will grow" },
    ];
};

export default function Home() {
    const insightsQuery = useQuery(() => ({
        queryKey: ["insights"],
        queryFn: fetchInsights,
    }));

    return (
        <div class="relative min-h-screen bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200">
            {/* Hero Section */}
            <div class="container mx-auto px-4 py-16 text-center pt-24">
                <h1 class="text-5xl font-bold text-black mb-4">
                    Make better decisions, faster
                </h1>
                <p class="text-xl text-black mb-8">
                    Discover and act on private market data with predictive intelligence
                </p>

                {/* Search Bar */}
                <div class="max-w-2xl mx-auto relative">
                    <TextFieldRoot>
                        <TextField
                            placeholder="Compare Airbnb vs. Vrbo"
                            class="w-full mb-4 p-3 rounded-lg shadow-sm"
                        />
                        {/* Simple dropdown simulation */}
                        <div class="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-1 p-2 text-left text-sm text-gray-600">
                            <p>Find SaaS companies that are likely growing</p>
                            <p>Cybersecurity exits in the last 12 months</p>
                        </div>
                    </TextFieldRoot>
                </div>

                {/* CTA Button */}
                <Button variant="outline" class="mb-4 border-black text-black">
                    Get the full experience.
                </Button>
                <a href="#" class="text-blue-600 hover:underline ml-4">
                    See Plans
                </a>

                {/* Statistics */}
                <div class="flex justify-center space-x-8 mt-8">
                    <div>
                        <p class="text-2xl font-bold text-black">12,109,471</p>
                        <p class="text-sm text-black">new predictions</p>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-black">41,004</p>
                        <p class="text-sm text-black">new insights</p>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-black">3,345</p>
                        <p class="text-sm text-black">new funding rounds</p>
                    </div>
                </div>

                {/* Trending Insights / Predictions */}
                <div class="mt-16">
                    <Tabs defaultValue="insights" class="w-full">
                        <TabsList class="flex justify-center space-x-4 mb-8">
                            <TabsTrigger
                                value="insights"
                                class="text-black data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                            >
                                Trending Insights
                            </TabsTrigger>
                            <TabsTrigger
                                value="predictions"
                                class="text-black data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                            >
                                Predictions
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="insights">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                                {insightsQuery.data?.map((insight) => (
                                    <Card class="bg-white shadow-md">
                                        <CardHeader>
                                            <CardTitle class="text-lg font-bold">
                                                {insight.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p class="text-sm text-gray-600">{insight.subtitle}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="predictions">
                            <p class="text-black">
                                Predictions content goes here (add API logic as needed).
                            </p>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Floating Chat Button */}
            <Button class="fixed bottom-4 right-4 rounded-full p-4 bg-blue-600 text-white shadow-lg hover:bg-blue-700">
                Chat
            </Button>
        </div>
    );
}