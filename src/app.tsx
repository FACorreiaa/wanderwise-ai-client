import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import Footer from "~/components/Footer"; // Import the new component
import PWAInstall from "~/components/PWAInstall";
import "./app.css";
import { QueryClientProvider } from "@tanstack/solid-query";
import { AuthProvider } from "~/contexts/AuthContext";
import { ThemeProvider } from "~/contexts/ThemeContext";
import { LocationProvider } from "~/contexts/LocationContext";
import queryClient from "~/lib/query-client";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router
          root={props => (
            <AuthProvider>
              <LocationProvider>
                <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
                  <Nav />
                  <main class="flex-grow min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
                    <Suspense>{props.children}</Suspense>
                  </main>
                  <Footer />
                  <PWAInstall />
                </div>
              </LocationProvider>
            </AuthProvider>
          )}
        >
          <FileRoutes />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}