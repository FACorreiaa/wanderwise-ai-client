import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import Footer from "~/components/Footer"; // Import the new component
import PWAInstall from "~/components/PWAInstall";
import "./app.css";
import { QueryClientProvider } from "@tanstack/solid-query";
// @ts-ignore - Context type
import { AuthProviderSwitch } from "~/contexts/AuthProviderSwitch";
import { ThemeProvider } from "~/contexts/ThemeContext";
// @ts-ignore - Context type
import { LocationProvider } from "~/contexts/LocationContext";
import queryClient from "~/lib/query-client";


export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <Router
                    root={props => (

                        <LocationProvider>
                            <AuthProviderSwitch>
                                <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
                                    <Nav />
                                    <main class="flex-grow min-h-screen ...">
                                        <Suspense>{props.children}</Suspense>
                                    </main>
                                    <Footer />
                                    <PWAInstall />
                                </div>
                            </AuthProviderSwitch>
                        </LocationProvider>
                    )}
                >
                    <FileRoutes />
                </Router>
            </ThemeProvider>
        </QueryClientProvider>
    );
}