import { Link, useLocation } from "react-router-dom";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <>
      <div className="flag-bar" />
      <nav className="bg-surface sticky top-0 z-50 shadow-card">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-xl text-foreground">MoMoSense</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {isLanding && (
              <>
                <a href="#features" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm font-medium text-muted hover:text-foreground transition-colors">How it Works</a>
                <a href="#privacy" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Privacy</a>
              </>
            )}
            <Link to="/pricing" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/converter" className="text-sm font-medium text-muted hover:text-foreground transition-colors">PDF to CSV</Link>
          </div>

          <Link to="/dashboard">
            <Button className="rounded-[10px] font-heading font-semibold text-sm">
              Analyse My Statement
            </Button>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
