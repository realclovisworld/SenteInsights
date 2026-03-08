import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import App from "./App.tsx";
import "./index.css";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log("[MoMoSense] Clerk publishable key loaded:", CLERK_PUBLISHABLE_KEY ? "✅ present" : "❌ MISSING");

if (!CLERK_PUBLISHABLE_KEY) {
  console.error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
