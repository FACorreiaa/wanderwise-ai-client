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
import CTASeciton from '@/components/features/Home/CTA';
import Trending from '@/components/features/Home/Trending';
import Hero from '@/components/features/Home/Hero';

const CrunchbaseLanding: Component = () => {



    return (
        <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
            {/* Hero Section */}

            <Hero />
            {/* Statistics Section */}


            {/* Trending Section */}
            <Trending />

            <CTASeciton />



        </div>
    );
};

export default CrunchbaseLanding;