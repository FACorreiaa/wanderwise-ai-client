import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import Footer from "~/components/Footer"; // Import the new component
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <div class="min-h-screen flex flex-col">
          <Nav />
          <main class="flex-grow">
            <Suspense>{props.children}</Suspense>
          </main>
          <Footer />
        </div>
      )}
    >
      <FileRoutes />
    </Router>
  );
}