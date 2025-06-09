import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import Footer from "~/components/Footer"; // Import the new component
import "./app.css";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router
        root={props => (
          <div class="min-h-screen flex flex-col">
            <Nav />
            <main class="flex-grow min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white">
              <Suspense>{props.children}</Suspense>
            </main>
            <Footer />
          </div>
        )}
      >
        <FileRoutes />
      </Router>
    </QueryClientProvider>
  );
}