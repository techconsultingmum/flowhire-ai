import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" aria-label="Hireflow - Go to homepage">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm" aria-hidden="true">H</span>
            </div>
            <span className="text-xl font-bold text-foreground">Hireflow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/integrations-overview" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Integrations
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden py-4 border-t border-border animate-slide-up"
            role="menu"
          >
            <div className="flex flex-col gap-4">
              <a href="/#features" onClick={handleNavClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors" role="menuitem">
                Features
              </a>
              <Link to="/pricing" onClick={handleNavClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors" role="menuitem">
                Pricing
              </Link>
              <Link to="/integrations-overview" onClick={handleNavClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors" role="menuitem">
                Integrations
              </Link>
              <Link to="/about" onClick={handleNavClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors" role="menuitem">
                About
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Link to="/login" onClick={handleNavClick}>
                  <Button variant="ghost" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/login" onClick={handleNavClick}>
                  <Button className="w-full">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}