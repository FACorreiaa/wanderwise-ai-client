import { Building2 } from 'lucide-solid';

export default function Footer() {
    return (
        <footer class="relative isolate overflow-hidden bg-slate-950 text-white border-t border-white/10">
            <div
                class="absolute inset-0 opacity-70"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 12% 18%, rgba(14,165,233,0.28), transparent 28%), radial-gradient(circle at 85% 12%, rgba(168,85,247,0.24), transparent 26%), radial-gradient(circle at 50% 120%, rgba(52,211,153,0.18), transparent 34%)',
                }}
                aria-hidden="true"
            />
            <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:120px_120px] opacity-30 [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.75),transparent_65%)]" aria-hidden="true" />
            <div class="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-70" aria-hidden="true" />

            <div class="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
                <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                    <div class="max-w-sm space-y-4">
                        <div class="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-cyan-200 ring-1 ring-white/10">
                            <span class="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_0_6px_rgba(34,211,238,0.18)]" />
                            <span>Intelligent locations, simplified</span>
                        </div>
                        <div class="flex items-center gap-3 text-cyan-100">
                            <div class="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                                <Building2 class="h-5 w-5" />
                            </div>
                            <div>
                                <p class="text-lg font-semibold tracking-tight text-white">Loci</p>
                                <p class="text-sm text-slate-300/80">Find, assess, and act on business opportunities with clarity.</p>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 text-xs text-slate-200/70">
                            <span class="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">Data-backed scouting</span>
                            <span class="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">AI recommendations</span>
                            <span class="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">Team-ready</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
                        <div class="space-y-3">
                            <h3 class="text-sm font-semibold text-white">Products</h3>
                            <ul class="space-y-2 text-sm text-slate-100">
                                <li><a class="transition-colors duration-200 hover:text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded" href="#">Platform</a></li>
                                <li><a class="transition-colors duration-200 hover:text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded" href="#">Enterprise</a></li>
                                <li><a class="transition-colors duration-200 hover:text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded" href="#">API</a></li>
                            </ul>
                        </div>
                        <div class="space-y-3">
                            <h3 class="text-sm font-semibold text-white">Resources</h3>
                            <ul class="space-y-2 text-sm text-slate-100">
                                <li><a class="transition-colors duration-200 hover:text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded" href="#">Blog</a></li>
                                <li><a class="transition-colors duration-200 hover:text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded" href="#">Reports</a></li>
                                <li><a class="transition-colors duration-200 hover:text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded" href="#">Help Center</a></li>
                            </ul>
                        </div>
                        <div class="space-y-3">
                            <h3 class="text-sm font-semibold text-white">Company</h3>
                            <ul class="space-y-2 text-sm text-slate-100">
                                <li><a class="transition-colors duration-200 hover:text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded" href="#">About</a></li>
                                <li><a class="transition-colors duration-200 hover:text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded" href="#">Careers</a></li>
                                <li><a class="transition-colors duration-200 hover:text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded" href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div class="space-y-3">
                            <h3 class="text-sm font-semibold text-white">Stay in touch</h3>
                            <ul class="space-y-2 text-sm text-slate-100">
                                <li><a class="transition-colors duration-200 hover:text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded" href="#">Status</a></li>
                                <li><a class="transition-colors duration-200 hover:text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded" href="#">Security</a></li>
                                <li><a class="transition-colors duration-200 hover:text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded" href="#">Press</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-2 text-white">
                        <Building2 class="h-4 w-4 text-cyan-300" />
                        <span class="font-medium">Loci</span>
                    </div>
                    <div class="flex flex-wrap gap-4 text-slate-100">
                        <a class="hover:text-cyan-300 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded" href="#">Privacy</a>
                        <a class="hover:text-cyan-300 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded" href="#">Terms</a>
                        <a class="hover:text-cyan-300 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded" href="#">Support</a>
                    </div>
                    <p class="text-slate-200">© 2025 Loci Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
