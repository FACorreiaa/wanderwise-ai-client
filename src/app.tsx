import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import Nav from "~/components/Nav";
import Footer from "~/components/Footer";
import PWAInstall from "~/components/PWAInstall";
import GlobalErrorBoundary from "~/components/GlobalErrorBoundary";
import "./app.css";
import { QueryClientProvider } from "@tanstack/solid-query";
// @ts-ignore - Context type
import { AuthProvider } from "~/contexts/AuthContext";
import { ThemeProvider } from "~/contexts/ThemeContext";
// @ts-ignore - Context type
import { LocationProvider } from "~/contexts/LocationContext";
import queryClient from "~/lib/query-client";
import PageBackground from "./components/PageBackground";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MetaProvider>
        <ThemeProvider>
          <GlobalErrorBoundary>
            <Router
              root={(props) => (
                <AuthProvider>
                  <LocationProvider>
                    <div class="min-h-screen flex flex-col relative overflow-hidden transition-colors">
                      <PageBackground />

                      <div class="relative z-10 flex flex-col min-h-screen">
                        <Nav />
                        <main class="relative flex-grow">
                          <div class="relative min-h-screen">
                            <Suspense>{props.children}</Suspense>
                          </div>
                        </main>
                        <Footer />
                        <PWAInstall />
                      </div>
                    </div>
                  </LocationProvider>
                </AuthProvider>
              )}
            >
              <FileRoutes />
            </Router>
          </GlobalErrorBoundary>
        </ThemeProvider>
      </MetaProvider>
    </QueryClientProvider>
  );
}
