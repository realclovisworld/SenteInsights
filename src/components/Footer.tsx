import { Scale, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const productLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/converter", label: "PDF to CSV" },
  { to: "/pricing", label: "Pricing" },
  { to: "/api-usage", label: "API" },
];

const companyLinks = [
  { to: "/about", label: "About Us" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
];

const Footer = () => (
  <footer className="bg-surface border-t border-border py-10">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <span className="font-heading font-bold text-foreground">MoMoSense</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            AI-powered mobile money statement analysis. Upload, analyse, and understand your finances.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Product</h4>
          <nav className="flex flex-col gap-2">
            {productLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-xs text-muted hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Company</h4>
          <nav className="flex flex-col gap-2">
            {companyLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-xs text-muted hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Contact</h4>
          <a
            href="mailto:support@momosense.app"
            className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            support@momosense.app
          </a>
        </div>
      </div>

      <div className="border-t border-border pt-4 text-center">
        <p className="text-xs text-muted">© {new Date().getFullYear()} MoMoSense. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
