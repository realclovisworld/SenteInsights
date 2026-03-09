import { Scale, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const productLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/converter", label: "PDF to CSV" },
  { to: "/pricing",   label: "Pricing" },
  { to: "/api-usage", label: "API" },
];

const companyLinks = [
  { to: "/about",   label: "About" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms",   label: "Terms of Service" },
];

const Footer = () => (
  <footer className="bg-gradient-to-b from-blue-600 to-blue-700 py-12">
    <div className="container mx-auto px-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">

        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-[7px] bg-white/20"
              style={{ boxShadow: "0 2px 8px rgba(255,255,255,.16)" }}
            >
              <Scale className="h-3.5 w-3.5 text-white" strokeWidth={2.2} />
            </div>
            <span className="font-heading font-semibold text-[15px] tracking-tight text-white">
              SenteInsights
            </span>
          </div>
          <p className="text-xs text-blue-100 leading-relaxed">
            AI-powered mobile money analysis. Upload, analyse, and understand your finances.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-xs font-semibold text-white tracking-wide uppercase mb-4">Product</h4>
          <nav className="flex flex-col gap-2.5">
            {productLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs text-blue-100 hover:text-white transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs font-semibold text-white tracking-wide uppercase mb-4">Company</h4>
          <nav className="flex flex-col gap-2.5">
            {companyLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs text-blue-100 hover:text-white transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-semibold text-white tracking-wide uppercase mb-4">Contact</h4>
          <a
            href="mailto:hello@senteinsights.com"
            className="flex items-center gap-1.5 text-xs text-blue-100 hover:text-white transition-colors duration-150"
          >
            <Mail className="w-3.5 h-3.5" strokeWidth={2} />
            hello@senteinsights.com
          </a>
        </div>
      </div>

      <div className="border-t border-blue-500/30 pt-5">
        <p className="text-xs text-blue-100">
          &copy; {new Date().getFullYear()} SenteInsights. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
