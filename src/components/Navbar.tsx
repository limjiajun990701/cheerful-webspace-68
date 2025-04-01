
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, Book, Search, Rss } from "lucide-react";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Experience", path: "/experience" },
  { name: "Projects", path: "/projects" },
  { name: "Certifications & Badges", path: "/certifications" },
  { name: "Blog", path: "/blog" },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isBlogPage = location.pathname.includes("/blog");

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
    setShowSearch(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-md border-b border-border shadow-sm" 
          : isBlogPage ? "bg-white/70 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink 
              to="/" 
              className="text-xl font-semibold flex items-center gap-2"
              onClick={closeMenu}
            >
              {isBlogPage && <Book className="h-5 w-5 text-primary" />}
              <span className="text-primary">Portfolio</span>
            </NavLink>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            {!isBlogPage ? (
              <ul className="flex space-x-8">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => 
                        `underline-animation py-1 smooth-transition ${
                          isActive 
                            ? "text-primary font-medium" 
                            : "text-foreground hover:text-primary"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink 
                  to="/blog" 
                  className={({ isActive }) => 
                    `underline-animation py-1 smooth-transition ${
                      isActive 
                        ? "text-primary font-medium" 
                        : "text-foreground hover:text-primary"
                    }`
                  }
                >
                  All Posts
                </NavLink>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 rounded-full text-foreground hover:bg-accent smooth-transition"
                  aria-label="Search blog"
                >
                  <Search size={18} />
                </button>
                <button
                  onClick={() => {}}
                  className="p-2 rounded-full text-foreground hover:bg-accent smooth-transition"
                  aria-label="RSS Feed"
                >
                  <Rss size={18} />
                </button>
              </div>
            )}
          </nav>
          
          <div className="md:hidden flex items-center">
            {isBlogPage && (
              <>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 mr-2 rounded-lg text-foreground hover:bg-accent smooth-transition"
                  aria-label="Search blog"
                >
                  <Search size={20} />
                </button>
              </>
            )}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-foreground hover:bg-accent smooth-transition"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {showSearch && (
        <div className="border-t border-border bg-white/80 backdrop-blur-md py-3 px-4 animate-slide-down">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto">
              <input
                type="search"
                placeholder="Search articles..."
                className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
      
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 pb-5 pt-2 glass-effect">
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `block py-2 px-3 rounded-lg smooth-transition ${
                      isActive 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-foreground hover:bg-accent"
                    }`
                  }
                  onClick={closeMenu}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
