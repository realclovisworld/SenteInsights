import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import { Component, type ReactNode } from "react";
import App from "./App.tsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_dmVyaWZpZWQtbmV3dC0zOC5jbGVyay5hY2NvdW50cy5kZXYk";

class ClerkErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.warn("Clerk failed to load, running without auth:", error.message);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const root = createRoot(document.getElementById("root")!);

root.render(
  <ClerkErrorBoundary fallback={<App />}>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </ClerkErrorBoundary>
);
