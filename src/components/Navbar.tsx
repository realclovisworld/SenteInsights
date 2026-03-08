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
    ...(isLanding
      ? [
          { href: "#features", label: "Features", isAnchor: true },
        ]
      : []),
    { href: "/pricing", label: "Pricing", isAnchor: false },
  ];

  return (
    <>
      <div className="flag-bar" />
      <nav className="bg-surface sticky top-0 z-50 shadow-card">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-xl text-foreground">MoMoSense</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isAnchor ? (
                <a key={link.href} href={link.href} className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} to={link.href} className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isSignedIn ? (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Link to="/register" className="hidden sm:block">
                  <Button variant="outline" className="rounded-[10px] font-heading font-semibold text-sm">
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <UserButton />
            )}

            <Link to="/dashboard" className="hidden sm:block">
              <Button className="rounded-[10px] font-heading font-semibold text-sm">
                Analyse My Statement
              </Button>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted/20 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-surface px-4 pb-4 pt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) =>
              link.isAnchor ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted/20 transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted/20 transition-colors"
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
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted/20 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted/20 transition-colors"
                >
                  Register
                </Link>
              </>
            )}

            <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block mt-2">
              <Button className="w-full rounded-[10px] font-heading font-semibold text-sm">
                Analyse My Statement
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
