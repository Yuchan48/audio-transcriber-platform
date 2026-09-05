// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <Sentry.ErrorBoundary
    fallback={
      <div className="w-full h-screen flex items-center justify-center">
        Something went wrong. Please refresh the page and try again.
      </div>
    }
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </Sentry.ErrorBoundary>,
);
