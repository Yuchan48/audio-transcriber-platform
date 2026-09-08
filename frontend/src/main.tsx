// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";

import { getCookieConsentValue } from "react-cookie-consent";

import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
  });
}

import { PostHogProvider } from "@posthog/react";
const options = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
};

const hasAnalyticsConsent =
  getCookieConsentValue("audioTranscriberCookieConsent") === "true";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

const app = (
  <AuthProvider>
    <App />
  </AuthProvider>
);

createRoot(root).render(
  <Sentry.ErrorBoundary
    fallback={
      <div className="w-full h-screen flex items-center justify-center">
        Something went wrong. Please refresh the page and try again.
      </div>
    }
  >
    {hasAnalyticsConsent ? (
      <PostHogProvider
        apiKey={import.meta.env.VITE_POSTHOG_PROJECT_TOKEN}
        options={options}
      >
        {app}
      </PostHogProvider>
    ) : (
      app
    )}
  </Sentry.ErrorBoundary>,
);
