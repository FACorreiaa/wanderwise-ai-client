import { Component } from 'solid-js';
import CTASeciton from '@/components/features/Home/CTA';
import Trending from '@/components/features/Home/Trending';
import Hero from '@/components/features/Home/Hero';

const LandingPage: Component = () => {
    return (
        <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
            <Hero />
            <Trending />
            <CTASeciton />
        </div>
    );
};

export default LandingPage;