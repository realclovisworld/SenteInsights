import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import App from "./App.tsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_dmVyaWZpZWQtbmV3dC0zOC5jbGVyay5hY2NvdW50cy5kZXYk";

const root = createRoot(document.getElementById("root")!);

if (PUBLISHABLE_KEY) {
  root.render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  );
} else {
  console.warn("Clerk Publishable Key not found. Auth features will be disabled.");
  root.render(<App />);
}
