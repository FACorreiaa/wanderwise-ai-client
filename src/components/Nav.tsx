import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { useLocation } from "@solidjs/router";
import { A } from '@solidjs/router';
import { Menu, X, User, Settings, LogOut, MessageCircle, Heart, List, MapPin, Sun, Moon } from "lucide-solid";
import { createSignal, For, Show, onMount, onCleanup } from "solid-js";
import { ImageRoot, ImageFallback, Image } from "@/ui/image";
import { useAuth } from "~/contexts/AuthContext";
import { useTheme } from "~/contexts/ThemeContext";
import PWAInstall from "~/components/PWAInstall";
import ThemeSelector from "~/components/ThemeSelector";

// Public navigation items (for non-authenticated users)
const publicNavigationItems = [
  { name: 'About', href: '/about' },
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' }
];

// Authenticated navigation items
const authNavigationItems = [
  { name: 'Discover', href: '/discover', icon: MapPin },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Favorites', href: '/favorites', icon: Heart },
  { name: 'Lists', href: '/lists', icon: List },
  { name: 'Profile', href: '/profile', icon: User }
];

export default function Nav() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  const [showUserMenu, setShowUserMenu] = createSignal(false);

  const active = (path: string) =>
    path == location.pathname ? "border-sky-600" : "border-transparent hover:border-sky-600";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close menus when clicking outside
  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container') && showUserMenu()) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    onCleanup(() => document.removeEventListener('click', handleClickOutside));
  });

  return (
    <nav class={`${isMenuOpen() ? 'bg-white dark:bg-gray-900' : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md'} border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors`}>
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Mobile First */}
          <div class="flex items-center">
            <A href="/" class="flex items-center">
              <div class="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                <ImageRoot>
                  <Image src="/images/loci-abstract-symbol.svg" class="w-full h-full object-contain" />
                  <ImageFallback class="w-full h-full bg-blue-600 text-white rounded flex items-center justify-center text-sm font-bold">L</ImageFallback>
                </ImageRoot>
              </div>
              <span class="ml-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors">Loci</span>
              <Show when={isAuthenticated()}>
                <Badge variant="secondary" class="ml-1 sm:ml-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">AI</Badge>
              </Show>
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

          {/* Desktop Navigation */}
          <Show
            when={isAuthenticated()}
            fallback={
              <div class="hidden md:flex items-center space-x-6 lg:space-x-8">
                <For each={publicNavigationItems}>
                  {(item) => (
                    <A
                      href={item.href}
                      class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors text-sm lg:text-base"
                    >
                      {item.name}
                    </A>
                  )}
                </For>
              </div>
            }
          >
            <div class="hidden md:flex items-center space-x-1">
              <For each={authNavigationItems}>
                {(item) => {
                  const IconComponent = item.icon;
                  return (
                    <A
                      href={item.href}
                      class={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors text-sm ${location.pathname === item.href
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                      <IconComponent class="w-4 h-4" />
                      {item.name}
                    </A>
                  );
                }}
              </For>
            </div>
          </Show>

          {/* Desktop User Menu or Auth Buttons */}
          <Show
            when={isAuthenticated()}
            fallback={
              <div class="hidden md:flex items-center space-x-3 lg:space-x-4">
                {/* PWA Install Button */}
                <PWAInstall />
                
                {/* Theme Selector for non-authenticated users */}
                <ThemeSelector />

                <A href="/auth/signin">
                  <Button variant="ghost" class="text-gray-700 dark:text-gray-300 text-sm lg:text-base px-3 lg:px-4">
                    Log In
                  </Button>
                </A>
                <A href="/auth/signup">
                  <Button class="bg-blue-600 hover:bg-blue-700 text-sm lg:text-base px-3 lg:px-4">
                    Get Started
                  </Button>
                </A>
              </div>
            }
          >
            <div class="hidden md:flex items-center space-x-3 relative user-menu-container">
              {/* PWA Install Button */}
              <PWAInstall />
              
              {/* Theme Selector */}
              <ThemeSelector />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu())}
                class="flex items-center gap-2 p-2"
              >
                <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user()?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{user()?.username || 'User'}</span>
              </Button>

              {/* User Dropdown Menu */}
              <Show when={showUserMenu()}>
                <div class="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 transition-colors">
                  <A
                    href="/settings"
                    class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings class="w-4 h-4" />
                    Settings
                  </A>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <LogOut class="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </Show>
            </div>
          </Show>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      <Show when={isMenuOpen()}>
        <div class="md:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900 transition-colors">
          <div class="flex flex-col h-full">
            {/* Mobile Header */}
            <div class="flex justify-between items-center px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <A href="/" class="flex items-center" onClick={() => setIsMenuOpen(false)}>
                <div class="w-6 h-6 flex items-center justify-center">
                  <ImageRoot>
                    <Image src="/images/loci-abstract-symbol.svg" class="w-full h-full object-contain" />
                    <ImageFallback class="w-full h-full bg-blue-600 text-white rounded flex items-center justify-center text-sm font-bold">L</ImageFallback>
                  </ImageRoot>
                </div>
                <span class="ml-2 text-lg font-bold text-gray-900 dark:text-white">Loci</span>
                <Show when={isAuthenticated()}>
                  <Badge variant="secondary" class="ml-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs px-1.5 py-0.5">AI</Badge>
                </Show>
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
              <Show
                when={isAuthenticated()}
                fallback={
                  <For each={publicNavigationItems}>
                    {(item) => (
                      <A
                        href={item.href}
                        class="block px-4 py-3 text-lg font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </A>
                    )}
                  </For>
                }
              >
                <For each={authNavigationItems}>
                  {(item) => {
                    const IconComponent = item.icon;
                    return (
                      <A
                        href={item.href}
                        class="flex items-center gap-3 px-4 py-3 text-lg font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <IconComponent class="w-5 h-5" />
                        {item.name}
                      </A>
                    );
                  }}
                </For>
              </Show>
            </div>

            {/* Mobile Action Buttons */}
            <Show
              when={!isAuthenticated()}
              fallback={
                <div class="px-4 py-6 space-y-3 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-3 px-4 py-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {user()?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div class="flex-1">
                      <div class="font-medium text-gray-900 dark:text-white">{user()?.username || 'User'}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{user()?.email || 'user@example.com'}</div>
                    </div>
                    <ThemeSelector />
                  </div>
                  <A href="/settings" class="block" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" class="w-full justify-center py-3 text-base">
                      Settings
                    </Button>
                  </A>
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    variant="outline"
                    class="w-full justify-center py-3 text-base text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Sign Out
                  </Button>
                </div>
              }
            >
              <div class="px-4 py-6 space-y-3 border-t border-gray-200 dark:border-gray-700">
                <div class="flex justify-center mb-3">
                  <ThemeSelector />
                </div>
                <A href="/auth/signin" class="block" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" class="w-full justify-center py-3 text-base">
                    Log In
                  </Button>
                </A>
                <A href="/auth/signup" class="block" onClick={() => setIsMenuOpen(false)}>
                  <Button class="w-full justify-center py-3 text-base bg-blue-600 hover:bg-blue-700">
                    Get Started
                  </Button>
                </A>
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </nav>
  );
}