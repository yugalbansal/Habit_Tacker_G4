
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/30 border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-primary font-bold text-xl mb-4">Itracker</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Track your habits, reach your goals, and become the best version of yourself with Itracker.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/dashboard">Dashboard</FooterLink>
              <FooterLink to="/user">Profile</FooterLink>
              <FooterLink to="/admin">Admin</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/cookies">Cookie Policy</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Itracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <li>
      <Link to={to} className="text-sm text-foreground/70 hover:text-primary transition-colors">
        {children}
      </Link>
    </li>
  );
};

export default Footer;
