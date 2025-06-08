import { Button } from "@/ui/button";

export default function CTA() {
    return (
        <section class="w-full py-12 bg-white/50">
            <div class="container text-center">
                <span class="text-lg text-gray-700 mr-4">Ready to explore smarter?</span>
                <Button size="lg" class="bg-orange-500 hover:bg-orange-600 text-white font-bold">
                    Get Started for Free
                </Button>
            </div>
        </section>
    );
}