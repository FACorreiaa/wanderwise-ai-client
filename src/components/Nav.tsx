import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { useLocation } from "@solidjs/router";
import { A } from '@solidjs/router';
import { Menu, X } from "lucide-solid";
import { createSignal, For, Show } from "solid-js";
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
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Mobile First */}
          <div class="flex items-center">
            <A href="/" class="flex items-center space-x-2">
              <div class="w-6 h-6 sm:w-8 sm:h-8">
                <ImageRoot>
                  <Image src="/images/loci.png" class="w-full h-full object-contain" />
                  <ImageFallback class="w-full h-full bg-blue-600 text-white rounded flex items-center justify-center text-sm font-bold">L</ImageFallback>
                </ImageRoot>
              </div>
              <span class="text-lg sm:text-xl font-bold text-gray-900">Loci</span>
              <Badge variant="secondary" class="ml-1 sm:ml-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">PRO</Badge>
            </A>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            class="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen())}
          >
            <Show when={!isMenuOpen()} fallback={<X class="w-5 h-5" />}>
              <Menu class="w-5 h-5" />
            </Show>
          </Button>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div class="hidden md:flex items-center space-x-6 lg:space-x-8">
            <For each={navigationItems}>
              {(item) => (
                <A
                  href={item.href}
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm lg:text-base"
                >
                  {item.name}
                </A>
              )}
            </For>
          </div>

          {/* Desktop Action Buttons - Hidden on Mobile */}
          <div class="hidden md:flex items-center space-x-3 lg:space-x-4">
            <A href="/auth/signin">
              <Button variant="ghost" class="text-gray-700 text-sm lg:text-base px-3 lg:px-4">
                Log In
              </Button>
            </A>
            <Button class="bg-blue-600 hover:bg-blue-700 text-sm lg:text-base px-3 lg:px-4">
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      <Show when={isMenuOpen()}>
        <div class="md:hidden fixed inset-0 z-50 bg-white">
          <div class="flex flex-col h-full">
            {/* Mobile Header */}
            <div class="flex justify-between items-center px-4 py-4 border-b border-gray-200">
              <A href="/" class="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                <div class="w-6 h-6">
                  <ImageRoot>
                    <Image src="/images/loci.png" class="w-full h-full object-contain" />
                    <ImageFallback class="w-full h-full bg-blue-600 text-white rounded flex items-center justify-center text-sm font-bold">L</ImageFallback>
                  </ImageRoot>
                </div>
                <span class="text-lg font-bold text-gray-900">Loci</span>
                <Badge variant="secondary" class="ml-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5">PRO</Badge>
              </A>
              <Button
                variant="ghost"
                size="sm"
                class="p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <X class="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile Navigation Links */}
            <div class="flex-1 px-4 py-6 space-y-1">
              <For each={navigationItems}>
                {(item) => (
                  <A
                    href={item.href}
                    class="block px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </A>
                )}
              </For>
            </div>

            {/* Mobile Action Buttons */}
            <div class="px-4 py-6 space-y-3 border-t border-gray-200">
              <A href="/auth/signin" class="block" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" class="w-full justify-center py-3 text-base">
                  Log In
                </Button>
              </A>
              <Button class="w-full justify-center py-3 text-base bg-blue-600 hover:bg-blue-700">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </Show>
    </nav>
  );
}