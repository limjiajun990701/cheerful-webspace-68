import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink } from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { theme } = useTheme();

  return (
    <div className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="font-bold text-xl">
          My Portfolio
        </Link>

        <nav className="flex items-center gap-2">
          <a
            href="/skills"
            className="px-3 py-2 rounded text-sm hover:bg-muted transition-colors"
          >
            Skills
          </a>
          <Link
            to="/projects"
            className="px-3 py-2 rounded text-sm hover:bg-muted transition-colors"
          >
            Projects
          </Link>
          <Link
            to="/certifications"
            className="px-3 py-2 rounded text-sm hover:bg-muted transition-colors"
          >
            Certifications
          </Link>
          <Link
            to="/blogs"
            className="px-3 py-2 rounded text-sm hover:bg-muted transition-colors"
          >
            Blogs
          </Link>
          <Link
            to="/collections"
            className="px-3 py-2 rounded text-sm hover:bg-muted transition-colors"
          >
            Collections
          </Link>
          <Link
            to="/cheatsheets"
            className="px-3 py-2 rounded text-sm hover:bg-muted transition-colors"
          >
            Cheatsheets
          </Link>
          <ModeToggle />
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link to="/" className="font-bold text-3xl mb-8 block">
              My Portfolio
            </Link>
            <nav className="grid gap-6 text-foreground">
              <Link to="/skills" className="hover:bg-secondary rounded-md p-2">Skills</Link>
              <Link to="/projects" className="hover:bg-secondary rounded-md p-2">Projects</Link>
              <Link to="/certifications" className="hover:bg-secondary rounded-md p-2">Certifications</Link>
              <Link to="/blogs" className="hover:bg-secondary rounded-md p-2">Blogs</Link>
              <Link to="/collections" className="hover:bg-secondary rounded-md p-2">Collections</Link>
              <Link to="/cheatsheets" className="hover:bg-secondary rounded-md p-2">Cheatsheets</Link>
            </nav>
            <ModeToggle />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
