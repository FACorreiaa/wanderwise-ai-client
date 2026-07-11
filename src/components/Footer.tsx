import { Building2 } from "lucide-solid";

const linkClass =
  "transition-colors duration-200 hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded";

export default function Footer() {
  return (
    <footer class="relative isolate overflow-hidden bg-card text-foreground border-t border-border">
      <div
        class="absolute inset-0 opacity-50"
        style={{
          "background-image":
            "radial-gradient(circle at 12% 18%, hsl(var(--primary) / 0.18), transparent 28%), radial-gradient(circle at 85% 12%, hsl(var(--accent) / 0.14), transparent 26%), radial-gradient(circle at 50% 120%, hsl(var(--primary) / 0.1), transparent 34%)",
        }}
        aria-hidden="true"
      />
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:120px_120px] opacity-30 [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.75),transparent_65%)]"
        aria-hidden="true"
      />
      <div
        class="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-70"
        aria-hidden="true"
      />

      <div class="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div class="max-w-sm space-y-4">
            <div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">
              <span class="h-2 w-2 rounded-full bg-primary shadow-[0_0_0_6px_hsl(var(--primary)/0.18)]" />
              <span>Intelligent locations, simplified</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-2xl bg-muted ring-1 ring-border">
                <Building2 class="h-5 w-5 text-primary" />
              </div>
              <div>
                <p class="text-lg font-semibold tracking-tight text-foreground">Loci</p>
                <p class="text-sm text-muted-foreground">
                  Find, assess, and act on business opportunities with clarity.
                </p>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span class="rounded-full bg-muted px-3 py-1 ring-1 ring-border">
                Data-backed scouting
              </span>
              <span class="rounded-full bg-muted px-3 py-1 ring-1 ring-border">
                AI recommendations
              </span>
              <span class="rounded-full bg-muted px-3 py-1 ring-1 ring-border">Team-ready</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-foreground">Products</h3>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a class={linkClass} href="#">
                    Platform
                  </a>
                </li>
                <li>
                  <a class={linkClass} href="#">
                    Enterprise
                  </a>
                </li>
                <li>
                  <a class={linkClass} href="#">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-foreground">Resources</h3>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a class={linkClass} href="#">
                    Blog
                  </a>
                </li>
                <li>
                  <a class={linkClass} href="#">
                    Reports
                  </a>
                </li>
                <li>
                  <a class={linkClass} href="#">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-foreground">Company</h3>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a class={linkClass} href="/about">
                    About
                  </a>
                </li>
                <li>
                  <a class={linkClass} href="#">
                    Careers
                  </a>
                </li>
                <li>
                  <a class={linkClass} href="#">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-foreground">Stay in touch</h3>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a class={linkClass} href="#">
                    Status
                  </a>
                </li>
                <li>
                  <a class={linkClass} href="#">
                    Security
                  </a>
                </li>
                <li>
                  <a class={linkClass} href="#">
                    Press
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 border-t border-border pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2 text-foreground">
            <Building2 class="h-4 w-4 text-primary" />
            <span class="font-medium">Loci</span>
          </div>
          <div class="flex flex-wrap gap-4 text-muted-foreground">
            <a class={`${linkClass} hover:text-primary`} href="#">
              Privacy
            </a>
            <a class={`${linkClass} hover:text-primary`} href="#">
              Terms
            </a>
            <a class={`${linkClass} hover:text-primary`} href="#">
              Support
            </a>
          </div>
          <p class="text-muted-foreground">© 2026 Loci Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}