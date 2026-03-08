import { Scale } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = [
  { to: "/about", label: "About Us" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
  { to: "/api-usage", label: "API Usage" },
  { to: "/pricing", label: "Pricing" },
];

const Footer = () => (
  <footer className="bg-surface border-t border-border py-8">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Scale className="h-5 w-5 text-primary" />
        <span className="font-heading font-bold text-foreground">MoMoSense</span>
      </div>

      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {footerLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <p className="text-xs text-muted">
        © {new Date().getFullYear()} MoMoSense.
      </p>
    </div>
  </footer>
);

export default Footer;
