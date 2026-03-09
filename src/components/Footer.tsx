import { Scale, Mail, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
  <footer className="bg-gradient-to-b from-blue-50 to-blue-100 border-t border-blue-200 py-16">
    <div className="container mx-auto px-5">
      {/* Upload CTA Section */}
      <div className="mb-16 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Ready to understand your money?
        </h3>
        <p className="text-muted mb-6 max-w-lg mx-auto">
          Upload your MTN MoMo or Airtel Money statement now. It's free, instant, and your data never leaves your browser.
        </p>
        <Link to="/dashboard">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-[12px] h-11 px-8 gap-2 hover:shadow-lg transition-shadow"
          >
            <Upload className="w-5 h-5" strokeWidth={2} />
            Upload Statement Now
          </Button>
        </Link>
      </div>

      <div className="border-t border-blue-200 pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-gradient-to-br from-blue-600 to-blue-700"
                style={{ boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }}
              >
                <Scale className="h-4 w-4 text-white" strokeWidth={2.2} />
              </div>
              <span className="font-heading font-bold text-[16px] tracking-tight bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                SenteInsights
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              AI-powered mobile money analysis. Upload, analyse, and understand your finances.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold text-foreground tracking-wide uppercase mb-4">Product</h4>
            <nav className="flex flex-col gap-2.5">
              {productLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-xs text-muted hover:text-blue-600 transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-foreground tracking-wide uppercase mb-4">Company</h4>
            <nav className="flex flex-col gap-2.5">
              {companyLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-xs text-muted hover:text-blue-600 transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-foreground tracking-wide uppercase mb-4">Contact</h4>
            <a
              href="mailto:hello@senteinsights.com"
              className="flex items-center gap-1.5 text-xs text-muted hover:text-blue-600 transition-colors duration-150"
            >
              <Mail className="w-3.5 h-3.5" strokeWidth={2} />
              hello@senteinsights.com
            </a>
          </div>
        </div>

        <div className="border-t border-blue-200 pt-5">
          <p className="text-xs text-muted text-center">
            &copy; {new Date().getFullYear()} SenteInsights. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
