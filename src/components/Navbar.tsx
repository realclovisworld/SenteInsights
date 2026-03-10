import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Scale, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, UserButton } from "@clerk/react";

const Navbar = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const navLinks = [
    { href: "/faq", label: "FAQ", isAnchor: false },
    { href: "/pricing", label: "Pricing", isAnchor: false },
    { href: "/about", label: "About", isAnchor: false },
  ];

  const linkClass =
    "relative text-[14px] font-medium text-muted transition-colors duration-200 " +
    "hover:text-foreground after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] " +
    "after:w-0 after:bg-primary after:rounded-full after:transition-all after:duration-200 " +
    "hover:after:w-full";

  return (
    <nav 
      className="sticky top-0 z-50 backdrop-blur-lg bg-white/50 border-b border-white/20"
      style={{
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.08)",
      }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-5">

        {/* Wordmark */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-600 to-blue-700" style={{ boxShadow: "0 4px 16px rgba(37, 99, 235, 0.4)" }}>
            <Scale className="h-5 w-5 text-white" strokeWidth={2.2} />
          </div>
          <span className="font-heading font-bold text-[18px] tracking-tight bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            SenteInsights
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.isAnchor ? (
              <a key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </a>
            ) : (
              <Link key={link.href} to={link.href} className={linkClass}>
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {!isSignedIn ? (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-[14px] font-medium text-muted hover:text-foreground transition-colors duration-200"
              >
                Log in
              </Link>
              <Link to="/register" className="hidden sm:block">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[14px] font-semibold text-foreground rounded-[10px] h-9 px-5 border-white/30 bg-white/40 backdrop-blur hover:bg-white/60"
                >
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <UserButton />
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-lg text-muted hover:text-foreground transition-colors duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/20 bg-white/50 backdrop-blur-xl px-5 pb-5 pt-3 space-y-0.5 animate-slide-down">
          {navLinks.map((link) =>
            link.isAnchor ? (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
              >
                {link.label}
              </Link>
            )
          )}

          {!isSignedIn && (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
