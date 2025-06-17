import { Building2 } from 'lucide-solid';

export default function Footer() {
    return (
        <footer class="bg-gray-900 dark:bg-gray-950 text-white py-8 sm:py-10 lg:py-12">
            <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                {/* Mobile-first grid: single column on mobile, then responsive */}
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {/* Brand section - full width on mobile */}
                    <div class="sm:col-span-2 lg:col-span-1">
                        <div class="flex items-center justify-center sm:justify-start space-x-2 mb-3 sm:mb-4">
                            <Building2 class="w-6 h-6" />
                            <span class="text-lg font-semibold">Loci</span>
                        </div>
                        <p class="text-gray-400 dark:text-gray-500 text-sm text-center sm:text-left max-w-xs mx-auto sm:mx-0">
                            The platform for finding business opportunities
                        </p>
                    </div>

                    {/* Products section */}
                    <div class="text-center sm:text-left">
                        <h3 class="font-semibold mb-3 sm:mb-4">Products</h3>
                        <ul class="space-y-2 text-sm text-gray-400 dark:text-gray-500">
                            <li><a href="#" class="hover:text-white dark:hover:text-gray-200 transition-colors duration-200">Platform</a></li>
                            <li><a href="#" class="hover:text-white dark:hover:text-gray-200 transition-colors duration-200">Enterprise</a></li>
                            <li><a href="#" class="hover:text-white dark:hover:text-gray-200 transition-colors duration-200">API</a></li>
                        </ul>
                    </div>

                    {/* Resources section */}
                    <div class="text-center sm:text-left">
                        <h3 class="font-semibold mb-3 sm:mb-4">Resources</h3>
                        <ul class="space-y-2 text-sm text-gray-400 dark:text-gray-500">
                            <li><a href="#" class="hover:text-white dark:hover:text-gray-200 transition-colors duration-200">Blog</a></li>
                            <li><a href="#" class="hover:text-white dark:hover:text-gray-200 transition-colors duration-200">Reports</a></li>
                            <li><a href="#" class="hover:text-white dark:hover:text-gray-200 transition-colors duration-200">Help Center</a></li>
                        </ul>
                    </div>

                    {/* Company section */}
                    <div class="text-center sm:text-left">
                        <h3 class="font-semibold mb-3 sm:mb-4">Company</h3>
                        <ul class="space-y-2 text-sm text-gray-400 dark:text-gray-500">
                            <li><a href="#" class="hover:text-white dark:hover:text-gray-200 transition-colors duration-200">About</a></li>
                            <li><a href="#" class="hover:text-white dark:hover:text-gray-200 transition-colors duration-200">Careers</a></li>
                            <li><a href="#" class="hover:text-white dark:hover:text-gray-200 transition-colors duration-200">Contact</a></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright section with mobile-first spacing */}
                <div class="border-t border-gray-800 dark:border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm text-gray-400 dark:text-gray-500">
                    © 2025 Loci Inc. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}