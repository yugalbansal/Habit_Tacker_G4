
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Layout, BarChart3 } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 navbar-blur border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-primary font-bold text-2xl">Itracker</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              <NavLink to="/" isActive={isActive("/")}>
                Home
              </NavLink>
              <NavLink to="/dashboard" isActive={isActive("/dashboard")}>
                Dashboard
              </NavLink>
              <NavLink to="/user" isActive={isActive("/user")}>
                Profile
              </NavLink>
              <NavLink to="/admin" isActive={isActive("/admin")}>
                Admin
              </NavLink>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                Login
              </Button>
              <Button size="sm">Sign Up</Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-lg p-4 border-b border-border animate-fade-in">
          <div className="flex flex-col gap-4">
            <MobileNavLink to="/" label="Home" icon={<Layout size={18} />} onClick={toggleMenu} />
            <MobileNavLink to="/dashboard" label="Dashboard" icon={<BarChart3 size={18} />} onClick={toggleMenu} />
            <MobileNavLink to="/user" label="Profile" icon={<User size={18} />} onClick={toggleMenu} />
            <MobileNavLink to="/admin" label="Admin" icon={<BarChart3 size={18} />} onClick={toggleMenu} />
            <div className="flex gap-3 mt-2">
              <Button variant="outline" size="sm" className="flex-1">
                Login
              </Button>
              <Button size="sm" className="flex-1">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ 
  to, 
  isActive, 
  children 
}: { 
  to: string; 
  isActive: boolean; 
  children: React.ReactNode 
}) => {
  return (
    <Link
      to={to}
      className={`relative text-sm font-medium transition-colors hover:text-primary ${
        isActive ? "text-primary" : "text-foreground/80"
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute left-0 -bottom-[21px] h-[2px] w-full bg-primary" />
      )}
    </Link>
  );
};

const MobileNavLink = ({ 
  to, 
  label, 
  icon, 
  onClick 
}: { 
  to: string; 
  label: string; 
  icon: React.ReactNode; 
  onClick: () => void;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
        isActive ? "bg-secondary text-primary" : "text-foreground/80 hover:bg-secondary/50"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Navbar;
