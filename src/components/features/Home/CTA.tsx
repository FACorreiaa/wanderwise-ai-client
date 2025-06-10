import { Button } from "@/ui/button";

export default function CTA() {
    return (
        <section class="w-full py-12 sm:py-16 md:py-20 bg-white/50">
            <div class="container text-center px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                    <span class="text-base sm:text-lg text-gray-700 font-medium">
                        Ready to explore smarter?
                    </span>
                    <Button class="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-lg w-full sm:w-auto">
                        Get Started for Free
                    </Button>
                </div>
            </div>
        </section>
    );
}