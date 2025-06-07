import { Card } from '@/ui/card';
import { Component } from 'solid-js';

const FeaturedCompanies: Component = () => {
    return (
        <section class="py-20 bg-white">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center mb-10">Featured Companies</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card class="hover:shadow-lg transition-shadow">
                        <img
                            src="https://via.placeholder.com/300x150"
                            alt="Company 1"
                            class="w-full h-48 object-cover"
                        />
                        <div class="p-4">
                            <h3 class="text-xl font-semibold">Company 1</h3>
                            <p class="text-gray-600">Innovative tech solutions</p>
                        </div>
                    </Card>
                    <Card class="hover:shadow-lg transition-shadow">
                        <img
                            src="https://via.placeholder.com/300x150"
                            alt="Company 2"
                            class="w-full h-48 object-cover"
                        />
                        <div class="p-4">
                            <h3 class="text-xl font-semibold">Company 2</h3>
                            <p class="text-gray-600">Leading in finance</p>
                        </div>
                    </Card>
                    <Card class="hover:shadow-lg transition-shadow">
                        <img
                            src="https://via.placeholder.com/300x150"
                            alt="Company 3"
                            class="w-full h-48 object-cover"
                        />
                        <div class="p-4">
                            <h3 class="text-xl font-semibold">Company 3</h3>
                            <p class="text-gray-600">Pioneering healthcare</p>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCompanies;