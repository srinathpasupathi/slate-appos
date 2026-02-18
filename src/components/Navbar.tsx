import { ChevronDown, Search, Globe } from "lucide-react";
import zohoLogo from "@/assets/zoho-logo.svg";

const navItems = [
  { label: "Products", hasDropdown: true },
  { label: "Enterprise", hasDropdown: false },
  { label: "Customers", hasDropdown: true },
  { label: "Partners", hasDropdown: true },
  { label: "Resources", hasDropdown: true },
];

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border h-[var(--nav-height)] flex items-center px-6 lg:px-10">
      <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-10">
          <img src={zohoLogo} alt="Zoho" className="h-8 w-auto" />
          
          {/* Nav Links */}
          <ul className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-md">
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <Search className="h-4.5 w-4.5 text-foreground" />
          </button>
          <div className="hidden md:flex items-center gap-1.5 text-sm text-foreground">
            <Globe className="h-4 w-4" />
            <span>English</span>
          </div>
          <a href="#" className="hidden sm:inline text-sm font-medium text-foreground hover:text-primary transition-colors">
            Sign In
          </a>
          <a href="#" className="text-sm font-medium border border-primary text-primary px-4 py-1.5 rounded hover:bg-primary hover:text-primary-foreground transition-colors">
            Sign Up
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
