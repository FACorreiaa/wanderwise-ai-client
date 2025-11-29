import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { useLocation } from "@solidjs/router";
import { A } from '@solidjs/router';
import { Menu, X, User, Settings, LogOut, MessageCircle, Heart, List, MapPin, Sun, Moon, Clock, Compass } from "lucide-solid";
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
  { name: 'Discover', href: '/discover', icon: Compass },
  { name: 'Near Me', href: '/near', icon: MapPin },
  { name: 'Recents', href: '/recents', icon: Clock },
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
    <nav class={`${isMenuOpen() ? 'bg-white/80 dark:bg-slate-950/80' : 'bg-white/40 dark:bg-slate-950/40'} border-b border-white/30 dark:border-slate-800/70 sticky top-0 z-50 backdrop-blur-2xl shadow-[0_10px_45px_rgba(15,23,42,0.22)] transition-all`}>
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
              <span class="ml-2 text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Loci</span>
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
                      class="text-slate-700 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-300 font-medium transition-colors text-sm lg:text-base"
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
                      class={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm border ${location.pathname === item.href
                        ? 'bg-white/70 dark:bg-slate-900/60 text-slate-900 dark:text-white border-white/60 dark:border-slate-800 shadow-[0_12px_32px_rgba(12,74,110,0.18)]'
                        : 'text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-200 hover:bg-white/50 dark:hover:bg-slate-900/50 border-transparent hover:border-sky-200/70 dark:hover:border-slate-700'
                        }`}
                    >
                      <IconComponent class="w-4 h-4" />
                      {item.name}
                      <Show when={item.experimental}>
                        <Badge variant="secondary" class="ml-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs px-1.5 py-0.5">
                          Experimental
                        </Badge>
                      </Show>
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
                  <Button variant="ghost" class="text-slate-800 dark:text-slate-200 hover:text-cyan-400 dark:hover:text-cyan-300 text-sm lg:text-base px-3 lg:px-4">
                    Log In
                  </Button>
                </A>
                <A href="/auth/signup">
                  <Button class="text-sm lg:text-base px-3 lg:px-4 shadow-[0_12px_32px_rgba(12,125,242,0.22)]">
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
                class="flex items-center gap-2 p-2 hover:text-cyan-400 dark:hover:text-cyan-300"
              >
                <div class="w-8 h-8 rounded-full bg-[#0c7df2] flex items-center justify-center text-white text-sm font-bold shadow-lg ring-2 ring-white/60 dark:ring-slate-800">
                  {user()?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span class="text-sm font-medium text-slate-700 dark:text-slate-200">{user()?.username || 'User'}</span>
              </Button>

              {/* User Dropdown Menu */}
              <Show when={showUserMenu()}>
                <div class="absolute top-full right-0 mt-2 w-48 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-lg shadow-2xl border border-white/30 dark:border-slate-800/70 py-1 z-50 transition-colors">
                  <A
                    href="/settings"
                    class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors rounded-md mx-1"
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
                    class="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors rounded-md mx-1"
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
        <div class="md:hidden fixed inset-0 z-50 bg-transparent backdrop-blur-2xl border-t border-white/20 dark:border-slate-800/50 transition-colors">
          <div class="flex flex-col h-full">
            {/* Mobile Header */}
            <div class="flex justify-between items-center px-4 py-4 border-b border-white/40 dark:border-slate-800/60">
              <A href="/" class="flex items-center" onClick={() => setIsMenuOpen(false)}>
                <div class="w-6 h-6 flex items-center justify-center">
                  <ImageRoot>
                    <Image src="/images/loci-abstract-symbol.svg" class="w-full h-full object-contain" />
                    <ImageFallback class="w-full h-full bg-blue-600 text-white rounded flex items-center justify-center text-sm font-bold">L</ImageFallback>
                  </ImageRoot>
                </div>
                <span class="ml-2 text-lg font-bold text-slate-900 dark:text-white tracking-tight">Loci</span>
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
                      class="block px-4 py-3 text-lg font-medium text-slate-900 dark:text-slate-100 bg-white/60 dark:bg-slate-900/50 rounded-lg transition-all border border-white/40 dark:border-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.2)] hover:translate-y-[-1px]"
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
                      class="flex items-center gap-3 px-4 py-3 text-lg font-medium text-slate-900 dark:text-slate-100 bg-white/60 dark:bg-slate-900/50 rounded-lg transition-all border border-white/40 dark:border-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.2)] hover:translate-y-[-1px]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <IconComponent class="w-5 h-5" />
                      <div class="flex items-center gap-2">
                        {item.name}
                          <Show when={item.experimental}>
                            <Badge variant="secondary" class="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs px-1.5 py-0.5">
                              Experimental
                            </Badge>
                          </Show>
                        </div>
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
                <div class="px-4 py-6 space-y-3 border-t border-white/40 dark:border-slate-800/60">
                  <div class="flex items-center gap-3 px-4 py-3">
                  <div class="w-10 h-10 rounded-full bg-[#0c7df2] flex items-center justify-center text-white text-lg font-bold shadow-lg ring-2 ring-white/60 dark:ring-slate-800">
                    {user()?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                    <div class="flex-1">
                      <div class="font-medium text-slate-900 dark:text-white">{user()?.username || 'User'}</div>
                      <div class="text-sm text-slate-500 dark:text-slate-400">{user()?.email || 'user@example.com'}</div>
                    </div>
                    <ThemeSelector />
                  </div>
                  <A href="/settings" class="block" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" class="w-full justify-center py-3 text-base border-white/40 dark:border-slate-800/70 bg-white/40 dark:bg-slate-900/50 hover:border-cyan-300 hover:text-cyan-500">
                      Settings
                    </Button>
                  </A>
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    variant="outline"
                    class="w-full justify-center py-3 text-base text-red-500 border-red-200/70 dark:border-red-500/40 hover:bg-red-50/70 dark:hover:bg-red-500/10"
                  >
                    Sign Out
                  </Button>
                </div>
              }
            >
              <div class="px-4 py-6 space-y-3 border-t border-white/40 dark:border-slate-800/60">
                <div class="flex justify-center mb-3">
                  <ThemeSelector />
                </div>
                <A href="/auth/signin" class="block" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" class="w-full justify-center py-3 text-base border-white/50 dark:border-slate-800/70 bg-white/50 dark:bg-slate-900/50 hover:border-cyan-300 hover:text-cyan-500">
                    Log In
                  </Button>
                </A>
                <A href="/auth/signup" class="block" onClick={() => setIsMenuOpen(false)}>
                  <Button class="w-full justify-center py-3 text-base shadow-[0_12px_32px_rgba(12,125,242,0.22)]">
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
