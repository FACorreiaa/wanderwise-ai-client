import { Component } from 'solid-js';

const Stats: Component = () => {
    return (
        <section class="py-20 bg-gray-100">
            <div class="container mx-auto text-center px-4">
                <h2 class="text-3xl font-bold mb-10">Our Impact</h2>
                <div class="flex flex-col md:flex-row justify-around">
                    <div class="mb-6 md:mb-0">
                        <p class="text-4xl font-bold text-blue-600">10M</p>
                        <p class="text-gray-600">Users</p>
                    </div>
                    <div class="mb-6 md:mb-0">
                        <p class="text-4xl font-bold text-blue-600">500K</p>
                        <p class="text-gray-600">Companies</p>
                    </div>
                    <div>
                        <p class="text-4xl font-bold text-blue-600">100+</p>
                        <p class="text-gray-600">Countries</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;