import { Component } from 'solid-js';

const Footer: Component = () => {
    return (
        <footer class="bg-gray-800 text-white py-10">
            <div class="container mx-auto flex flex-col md:flex-row justify-between px-4">
                <div class="mb-6 md:mb-0">
                    <h4 class="font-bold mb-2">Company</h4>
                    <ul>
                        <li><a href="/about" class="hover:text-blue-400">About</a></li>
                        <li><a href="/contact" class="hover:text-blue-400">Contact</a></li>
                        <li><a href="/terms" class="hover:text-blue-400">Terms</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold mb-2">Follow Us</h4>
                    <div class="flex space-x-4">
                        <a href="#" class="hover:text-blue-400">Twitter</a>
                        <a href="#" class="hover:text-blue-400">Facebook</a>
                        <a href="#" class="hover:text-blue-400">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;