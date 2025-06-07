import { A } from "@solidjs/router";

export default function Footer() {
    return (
        <footer class="border-t bg-background">
            <div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 class="text-sm font-semibold text-muted-foreground tracking-wider uppercase">Solutions</h3>
                        <ul role="list" class="mt-4 space-y-2">
                            <li><A href="#" class="text-base text-foreground/80 hover:text-foreground">Marketing</A></li>
                            <li><A href="#" class="text-base text-foreground/80 hover:text-foreground">Analytics</A></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-muted-foreground tracking-wider uppercase">Support</h3>
                        <ul role="list" class="mt-4 space-y-2">
                            <li><A href="/pricing" class="text-base text-foreground/80 hover:text-foreground">Pricing</A></li>
                            <li><A href="#" class="text-base text-foreground/80 hover:text-foreground">Docs</A></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-muted-foreground tracking-wider uppercase">Company</h3>
                        <ul role="list" class="mt-4 space-y-2">
                            <li><A href="/about" class="text-base text-foreground/80 hover:text-foreground">About</A></li>
                            <li><A href="#" class="text-base text-foreground/80 hover:text-foreground">Blog</A></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-muted-foreground tracking-wider uppercase">Legal</h3>
                        <ul role="list" class="mt-4 space-y-2">
                            <li><A href="#" class="text-base text-foreground/80 hover:text-foreground">Privacy</A></li>
                            <li><A href="/terms" class="text-base text-foreground/80 hover:text-foreground">Terms</A></li>
                        </ul>
                    </div>
                </div>
                <div class="mt-8 border-t border-border pt-8">
                    <p class="text-base text-muted-foreground xl:text-center">
                        © {new Date().getFullYear()} DataSpark, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}