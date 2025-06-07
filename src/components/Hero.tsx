import { Button } from '@/ui/button';
import { Component } from 'solid-js';

const Hero: Component = () => {
    return (
        <section class="bg-blue-600 text-white py-20">
            <div class="container mx-auto text-center px-4">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">
                    Find the business information you need
                </h1>
                <p class="text-lg md:text-xl mb-8">
                    Search for companies, industries, and more
                </p>
                <Button size="lg" class="bg-white text-blue-600 hover:bg-gray-100">
                    Sign Up
                </Button>
            </div>
        </section>
    );
};

export default Hero;