import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { useLocation } from "@solidjs/router";
import { A } from '@solidjs/router';
import { Menu } from "lucide-solid";
import { createSignal, For } from "solid-js";
import { ImageRoot, ImageFallback, Image } from "@/ui/image";

const navigationItems = [
  { name: 'Solutions', href: '/solutions' },
  { name: 'Products', href: '/products' },
  { name: 'Resources', href: '/resources' },
  { name: 'Pricing', href: '/pricing' }
];

export default function Nav() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  const active = (path: string) =>
    path == location.pathname ? "border-sky-600" : "border-transparent hover:border-sky-600";
  return (
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          {/* Logo */}
          <div class="flex items-center">
            <A href="/" class="flex items-center space-x-2">
              <ImageRoot>
                <Image src="/images/loci.png" />
                <ImageFallback>HN</ImageFallback>
              </ImageRoot>

              <span class="text-xl font-bold text-gray-900">Loci</span>
              <Badge variant="secondary" class="ml-2 bg-blue-100 text-blue-800">PRO</Badge>
            </A>
          </div>

          {/* Desktop Navigation */}
          <div class="hidden md:flex items-center space-x-8">
            <For each={navigationItems}>
              {(item) => (
                <A
                  href={item.href}
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {item.name}
                </A>
              )}
            </For>
          </div>

          {/* Action Buttons */}
          <div class="hidden md:flex items-center space-x-4">
            <A href="/auth/signin">
              <Button variant="ghost" class="text-gray-700">
                Log In
              </Button>
            </A>
            <Button class="bg-blue-600 hover:bg-blue-700">
              Start Free Trial
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            class="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen())}
          >
            <Menu class="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}