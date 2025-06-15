
import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu, Home, User, ArrowRight, Search, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import ResumeButton from "@/components/navbar/ResumeButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "About", path: "/about", icon: User },
  { name: "Skills", path: "/skills", icon: ArrowRight },
  { name: "Projects", path: "/projects", icon: ArrowRight },
  { name: "Certifications", path: "/certifications", icon: Settings },
  { name: "Blogs", path: "/blogs", icon: Search },
  { name: "Collections", path: "/collections", icon: ArrowRight },
  { name: "Cheatsheets", path: "/cheatsheets", icon: ArrowRight },
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
          ? "bg-background/80 border-b border-border shadow-md"
          : "bg-background/70"
      }`}
    >
      <div className="container flex items-center justify-between py-2 md:py-3">
        <Link to="/" className="font-bold text-xl md:text-2xl tracking-tight text-primary hover:opacity-90">
          My Portfolio
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `group px-3 py-2 rounded-lg flex items-center gap-1 font-medium text-sm underline-animation transition-colors
                        ${
                          isActive
                            ? "text-primary bg-muted font-semibold"
                            : "text-foreground hover:text-primary hover:bg-muted/80"
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 mr-1 transition-transform group-hover:scale-110" />
                      <span>{item.name}</span>
                    </NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <ResumeButton />
          <ThemeToggle />
        </nav>
        {/* Mobile Nav Trigger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open Navigation">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 max-w-xs w-72">
              <div className="mt-4 mb-8">
                <Link to="/" className="font-bold text-2xl text-primary">
                  My Portfolio
                </Link>
              </div>
              <nav className="grid gap-3">
                {navItems.map((item) => (
                  <NavLink
                    to={item.path}
                    key={item.name}
                    className={({ isActive }) =>
                      `flex items-center gap-2 p-2 rounded-lg text-base font-medium transition-colors underline-animation ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-primary/10 hover:text-primary"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </NavLink>
                ))}
                <ResumeButton />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

