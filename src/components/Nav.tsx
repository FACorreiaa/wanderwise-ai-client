import { Button } from "@/ui/button";
import { TextField, TextFieldRoot } from "@/ui/textfield";
import { useLocation } from "@solidjs/router";
import { A } from '@solidjs/router';

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname ? "border-sky-600" : "border-transparent hover:border-sky-600";
  return (
    <header class="bg-transparent absolute top-0 left-0 w-full z-10">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div class="text-2xl font-bold text-black">Loci</div>

        {/* Navigation Links */}
        <nav class="flex space-x-6 items-center">
          <a href="#" class="text-black hover:underline">
            Resources
          </a>
          <a href="#" class="text-black hover:underline">
            Advanced Search
          </a>
        </nav>

        {/* CTA Buttons */}
        <div class="flex space-x-4 items-center">
          <Button variant="outline" class="border-black text-black">
            Start Free Trial
          </Button>
          <Button class="bg-blue-600 text-white hover:bg-blue-700">
            Talk with Sales
          </Button>
          <a href="#" class="text-black hover:underline">
            Pricing
          </a>
        </div>
      </div>
    </header>
  );
}



