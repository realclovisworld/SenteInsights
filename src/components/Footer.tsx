import { Scale } from "lucide-react";

const Footer = () => (
  <footer className="bg-surface border-t border-border py-8">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Scale className="h-5 w-5 text-primary" />
        <span className="font-heading font-bold text-foreground">MoMoSense</span>
      </div>
      <p className="text-xs text-muted">
        © {new Date().getFullYear()} MoMoSense. Built for Uganda. Your data stays private.
      </p>
    </div>
  </footer>
);

export default Footer;
