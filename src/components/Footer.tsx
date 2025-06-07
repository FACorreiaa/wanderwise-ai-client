import { Building2 } from 'lucide-solid';
import { Component } from 'solid-js';

const Footer: Component = () => {
    return (
        <footer class="bg-gray-900 text-white py-12">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div class="flex items-center space-x-2 mb-4">
                            <Building2 class="w-6 h-6" />
                            <span class="text-lg font-semibold">crunchbase</span>
                        </div>
                        <p class="text-gray-400 text-sm">
                            The platform for finding business opportunities
                        </p>
                    </div>

                    <div>
                        <h3 class="font-semibold mb-4">Products</h3>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="#" class="hover:text-white">Platform</a></li>
                            <li><a href="#" class="hover:text-white">Enterprise</a></li>
                            <li><a href="#" class="hover:text-white">API</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="font-semibold mb-4">Resources</h3>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="#" class="hover:text-white">Blog</a></li>
                            <li><a href="#" class="hover:text-white">Reports</a></li>
                            <li><a href="#" class="hover:text-white">Help Center</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="font-semibold mb-4">Company</h3>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="#" class="hover:text-white">About</a></li>
                            <li><a href="#" class="hover:text-white">Careers</a></li>
                            <li><a href="#" class="hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                    © 2025 Crunchbase Inc. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};



export default Footer;