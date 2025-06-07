import { A } from "@solidjs/router";
import { Button } from "@/ui/button";

export default function Nav() {
  return (
    <nav class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-14 items-center">
        <div class="mr-4 flex">
          <A href="/" class="mr-6 flex items-center space-x-2">
            {/* <img src="/path/to/your/logo.svg" alt="Logo" class="h-6 w-6" /> */}
            <span class="font-bold text-lg text-cb-blue">DataSpark</span> {/* Inspired by Crunchbase */}
          </A>
          <nav class="flex items-center gap-4 text-sm lg:gap-6">
            <A
              href="/solutions"
              class="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Solutions
            </A>
            <A
              href="/data"
              class="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Data
            </A>
            <A
              href="/pricing"
              class="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pricing
            </A>
          </nav>
        </div>
        <div class="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="sm">Log In</Button>
          <Button size="sm" class="bg-cb-blue hover:bg-cb-blue-dark">Start Free Trial</Button>
        </div>
      </div>
    </nav>
  );
}