import { Button } from "@/ui/button";

export default function CTA() {
    return (
        <section class="w-full py-12 sm:py-16 md:py-20 bg-background/50" aria-labelledby="cta-heading">
            <div class="container text-center px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                    <span id="cta-heading" class="text-base sm:text-lg text-foreground font-medium">
                        Ready to explore smarter?
                    </span>
                    <Button 
                        class="bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:bg-orange-700 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                        aria-label="Sign up for Loci to get started for free"
                    >
                        Get Started for Free
                    </Button>
                </div>
            </div>
        </section>
    );
}