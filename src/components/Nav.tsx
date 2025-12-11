import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { useLocation } from "@solidjs/router";
import { A } from '@solidjs/router';
import { Menu, X, User, Settings, LogOut, MessageCircle, Heart, List, MapPin, Clock, Compass, Bookmark } from "lucide-solid";
import { createSignal, For, Show, onMount, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { ImageRoot, ImageFallback, Image } from "@/ui/image";
import { useAuth } from "~/contexts/AuthContext";
import PWAInstall from "~/components/PWAInstall";
import ThemeSelector from "~/components/ThemeSelector";

// Public navigation items (for non-authenticated users)
const publicNavigationItems = [
  { name: 'About', href: '/about' },
  { name: 'Features', href: '/features' },
  { name: 'Roadmap', href: '/roadmap' },
  { name: 'Pricing', href: '/pricing' }
];

// Authenticated navigation items (main nav bar)
const authNavigationItems = [
  { name: 'Discover', href: '/discover', icon: Compass },
  { name: 'Near Me', href: '/nearme', icon: MapPin },
  { name: 'Recents', href: '/recents', icon: Clock },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
];

// User menu dropdown items
const userMenuItems = [
  { name: 'Favorites', href: '/favorites', icon: Heart },
  { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { name: 'My Lists', href: '/lists', icon: List },
  { name: 'Profile', href: '/profiles', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Nav() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
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
    <nav class="sticky top-0 z-50 backdrop-blur-2xl bg-white/95 dark:bg-gradient-to-r dark:from-[#050915]/90 dark:via-[#0b1c36]/90 dark:to-[#050915]/90 border-b border-gray-300 dark:border-white/10 shadow-lg dark:shadow-[0_18px_60px_rgba(3,7,18,0.45)] transition-all">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Mobile First */}
          <div class="flex items-center">
            <A href="/" class="flex items-center">
              <div class="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                <ImageRoot>
                  <Image src="/images/loci-abstract-symbol.svg" alt="Loci logo" class="w-full h-full object-contain" />
                  <ImageFallback class="w-full h-full bg-blue-600 text-white rounded flex items-center justify-center text-sm font-bold">L</ImageFallback>
                </ImageRoot>
              </div>
              <span class="ml-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">Loci</span>
              <Show when={isAuthenticated()}>
                <Badge variant="secondary" class="ml-1 sm:ml-2 bg-emerald-50 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-300/40 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">AI</Badge>
              </Show>
            </A>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            class="md:hidden p-2 text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-emerald-200"
            onClick={() => setIsMenuOpen(!isMenuOpen())}
            aria-label={isMenuOpen() ? "Close menu" : "Open menu"}
          >
            <Show when={!isMenuOpen()} fallback={<X class="w-5 h-5" />}>
              <Menu class="w-5 h-5" />
            </Show>
          </Button>

          {/* Desktop Navigation */}
          <Show when={!isLoading()}>
            <Show
              when={isAuthenticated()}
              fallback={
                <div class="hidden md:flex items-center space-x-6 lg:space-x-8">
                  <For each={publicNavigationItems}>
                    {(item) => (
                      <A
                        href={item.href}
                        class="text-gray-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-emerald-200 font-medium transition-colors text-sm lg:text-base"
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
                        class={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all text-sm border ${location.pathname === item.href
                          ? 'bg-blue-100 dark:bg-white/10 text-gray-900 dark:text-white border-blue-300 dark:border-white/20 shadow-lg'
                          : 'text-gray-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-emerald-200 hover:bg-gray-100 dark:hover:bg-white/5 border-transparent hover:border-blue-300 dark:hover:border-emerald-200/40'
                          }`}
                      >
                        <IconComponent class="w-4 h-4" />
                        {item.name}
                        <Show when={(item as any).experimental}>
                          <Badge variant="secondary" class="ml-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-700 text-xs px-1.5 py-0.5">
                            Experimental
                          </Badge>
                        </Show>
                      </A>
                    );
                  }}
                </For>
              </div>
            </Show>
          </Show>

          {/* Desktop User Menu or Auth Buttons */}
          <Show when={!isLoading()}>
            <Show
              when={isAuthenticated()}
              fallback={
                <div class="hidden md:flex items-center space-x-3 lg:space-x-4">
                  {/* PWA Install Button */}
                  <PWAInstall />

                  {/* Theme Selector for non-authenticated users */}
                  <ThemeSelector />

                  <A href="/auth/signin">
                    <Button variant="ghost" class="text-gray-700 dark:text-white hover:text-blue-700 dark:hover:text-emerald-200 text-sm lg:text-base px-3 lg:px-4 font-semibold">
                      Log In
                    </Button>
                  </A>
                  <A href="/auth/signup">
                    <Button class="text-sm lg:text-base px-3 lg:px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 dark:bg-emerald-400 dark:hover:bg-emerald-300 text-white dark:text-slate-950 font-semibold shadow-[0_14px_40px_rgba(52,211,153,0.35)]">Get Started</Button>
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
                  class="flex items-center gap-2 p-2 text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-emerald-200"
                >
                  <div class="w-8 h-8 rounded-full bg-emerald-600 dark:bg-emerald-400 flex items-center justify-center text-white dark:text-slate-950 text-sm font-bold shadow-lg ring-2 ring-emerald-200 dark:ring-white/40">
                    {(user()?.display_name || user()?.username || user()?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">
                    {user()?.display_name || user()?.username || user()?.email || 'Guest'}
                  </span>
                </Button>

                {/* User Dropdown Menu */}
                <Show when={showUserMenu()}>
                  <div class="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-[#0b1c36]/95 backdrop-blur-xl rounded-2xl shadow-[0_24px_70px_rgba(3,7,18,0.55)] border border-gray-300 dark:border-white/10 py-2 z-50 transition-colors">
                    {/* User Menu Items */}
                    <For each={userMenuItems}>
                      {(item) => {
                        const IconComponent = item.icon;
                        return (
                          <A
                            href={item.href}
                            class={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors mx-1 rounded-lg ${location.pathname === item.href
                              ? 'bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-blue-300'
                              : 'text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/5'
                              }`}
                            onClick={() => setShowUserMenu(false)}
                          >
                            <IconComponent class="w-4 h-4" />
                            {item.name}
                          </A>
                        );
                      }}
                    </For>

                    {/* Divider */}
                    <div class="my-2 mx-3 border-t border-gray-200 dark:border-white/10" />

                    {/* Sign Out */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg mx-1"
                    >
                      <LogOut class="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </Show>
              </div>
            </Show>
          </Show>
        </div>
      </div>

      <Show when={isMenuOpen()}>
        <Portal>
          <div class="md:hidden fixed inset-0 z-[100] transition-all duration-300">
            {/* Glassy Background Layer */}
            <div class="absolute inset-0 bg-white/80 dark:bg-[#050915]/80 backdrop-blur-3xl" />

            <div class="relative flex flex-col h-full overflow-y-auto">
              {/* Mobile Header */}
              {/* Mobile Header */}
              <div class="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200/50 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm sticky top-0 z-10 h-14 sm:h-16">
                <div class="flex items-center">
                  <div class="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                    <ImageRoot>
                      <Image src="/images/loci-abstract-symbol.svg" alt="Loci logo" class="w-full h-full object-contain" />
                      <ImageFallback class="w-full h-full bg-blue-600 text-white rounded flex items-center justify-center text-sm font-bold">L</ImageFallback>
                    </ImageRoot>
                  </div>
                  <span class="ml-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">Loci</span>
                  <Show when={isAuthenticated()}>
                    <Badge variant="secondary" class="ml-1 sm:ml-2 bg-emerald-50 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-300/40 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">AI</Badge>
                  </Show>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  class="md:hidden p-2 text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X class="w-6 h-6" />
                </Button>
              </div>

              {/* Mobile Navigation Links - Clean List Style */}
              <div class="flex-1 px-6 py-2">
                <Show when={!isLoading()}>
                  <div class="flex flex-col">
                    {/* Public Items */}
                    <Show when={!isAuthenticated()}>
                      <For each={publicNavigationItems}>
                        {(item) => (
                          <A
                            href={item.href}
                            class="group flex items-center justify-between py-5 text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200/50 dark:border-white/5 active:bg-black/5 dark:active:bg-white/5 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.name}
                            <span class="text-gray-400 dark:text-gray-600 group-hover:translate-x-1 transition-transform">→</span>
                          </A>
                        )}
                      </For>
                    </Show>

                    {/* Authenticated Items */}
                    <Show when={isAuthenticated()}>
                      <For each={authNavigationItems}>
                        {(item) => {
                          const IconComponent = item.icon;
                          return (
                            <A
                              href={item.href}
                              class="group flex items-center justify-between py-5 text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200/50 dark:border-white/5 active:bg-black/5 dark:active:bg-white/5 transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <div class="flex items-center gap-4">
                                <span class="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300">
                                  <IconComponent class="w-5 h-5" />
                                </span>
                                <div class="flex items-center gap-2">
                                  {item.name}
                                  <Show when={(item as any).experimental}>
                                    <Badge variant="secondary" class="bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-700/50 text-[10px] px-1.5 py-0.5 uppercase tracking-wider">
                                      Beta
                                    </Badge>
                                  </Show>
                                </div>
                              </div>
                              <span class="text-gray-400 dark:text-gray-600 group-hover:translate-x-1 transition-transform">→</span>
                            </A>
                          );
                        }}
                      </For>
                    </Show>
                  </div>
                </Show>
              </div>

              {/* Mobile Footer / User Action Area */}
              <Show when={!isLoading()}>
                <div class="p-6 mt-auto bg-white/50 dark:bg-black/20 backdrop-blur-md border-t border-gray-200/50 dark:border-white/10">
                  <Show
                    when={!isAuthenticated()}
                    fallback={
                      <div class="space-y-6">
                        {/* User Info */}
                        <div class="flex items-center gap-4">
                          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-2 ring-white/50 dark:ring-white/10">
                            {user()?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="font-bold text-lg text-gray-900 dark:text-white truncate">{user()?.username || 'User'}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400 truncate">{user()?.email}</div>
                          </div>
                          <ThemeSelector />
                        </div>

                        {/* Actions Grid */}
                        <div class="grid grid-cols-2 gap-3">
                          <A href="/settings" class="w-full" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="outline" class="w-full justify-center h-12 text-base border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-white/80 dark:hover:bg-white/10">
                              Settings
                            </Button>
                          </A>
                          <Button
                            onClick={() => {
                              setIsMenuOpen(false);
                              handleLogout();
                            }}
                            variant="outline"
                            class="w-full justify-center h-12 text-base text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20"
                          >
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    }
                  >
                    {/* Guest Actions */}
                    <div class="space-y-4">
                      <div class="flex justify-between items-center mb-4">
                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Appearance</span>
                        <ThemeSelector />
                      </div>
                      <A href="/auth/signin" class="block" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" class="w-full justify-center h-12 text-base font-semibold border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 text-gray-900 dark:text-white">
                          Log In
                        </Button>
                      </A>
                      <A href="/auth/signup" class="block" onClick={() => setIsMenuOpen(false)}>
                        <Button class="w-full justify-center h-12 text-base font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                          Get Started
                        </Button>
                      </A>
                    </div>
                  </Show>
                </div>
              </Show>
            </div>
          </div>
        </Portal>
      </Show>
    </nav>
  );
}
