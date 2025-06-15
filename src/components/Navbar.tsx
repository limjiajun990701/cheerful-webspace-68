
import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import ResumeButton from "@/components/navbar/ResumeButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Skills", path: "/skills" },
  { name: "Projects", path: "/projects" },
  { name: "Certifications", path: "/certifications" },
  { name: "Blogs", path: "/blog" },
  { name: "Collections", path: "/collections" },
  { name: "Cheatsheets", path: "/cheatsheets" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all backdrop-blur-md ${
        isScrolled
          ? "bg-background/80 border-b border-border shadow"
          : "bg-background/70"
      }`}
    >
      <div className="container flex items-center justify-between py-1.5 md:py-2">
        <Link
          to="/"
          className="font-semibold text-lg md:text-xl tracking-tight text-primary hover:opacity-90 transition-opacity"
          style={{ letterSpacing: "0" }}
        >
          My Portfolio
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              className={({ isActive }) =>
                `relative px-2 py-1 rounded text-sm font-normal
                 transition-all duration-150 
                 ${
                   isActive
                     ? "text-primary border-b-2 border-primary"
                     : "text-foreground hover:text-primary hover:border-b-2 hover:border-primary/80"
                 }`
              }
              style={{ borderBottomWidth: 2, borderColor: "transparent" }}
            >
              {item.name}
            </NavLink>
          ))}
          <ResumeButton />
          <ThemeToggle />
        </nav>
        {/* Mobile Nav Trigger */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open Navigation">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 max-w-xs w-64">
              <div className="mt-3 mb-6">
                <Link to="/" className="font-semibold text-xl text-primary">
                  My Portfolio
                </Link>
              </div>
              <nav className="grid gap-2">
                {navItems.map((item) => (
                  <NavLink
                    to={item.path}
                    key={item.name}
                    className={({ isActive }) =>
                      `block px-2 py-2 rounded text-base font-normal transition-all 
                      ${
                        isActive
                          ? "text-primary border-l-2 border-primary bg-muted"
                          : "text-foreground hover:text-primary"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                <div className="mt-2">
                  <ResumeButton />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
