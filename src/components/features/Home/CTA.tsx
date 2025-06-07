import { Button } from "@/ui/button";
import { Component } from "solid-js";

const CTASeciton: Component = () => {
    return (
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
    );
}

export default CTASeciton;
