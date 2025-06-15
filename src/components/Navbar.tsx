
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Book } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import NavLinks from "./navbar/NavLinks";
import MobileMenu from "./navbar/MobileMenu";
import BlogNavOptions from "./navbar/BlogNavOptions";
import SearchBar from "./navbar/SearchBar";
import ResumeButton from "./navbar/ResumeButton";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "My Skill", path: "/myskill" },
  { name: "Experience", path: "/experience" },
  { name: "Projects", path: "/projects" },
  { name: "Collections", path: "/collections" },
  { name: "Certifications & Badges", path: "/certifications" },
  { name: "Cheat Sheets", path: "/cheatsheets" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

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
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm" 
          : isBlogPage ? "bg-background/70 backdrop-blur-sm" : "bg-transparent"
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
              <>
                <NavLinks navItems={navItems} />
                <ThemeToggle />
                <ResumeButton />
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLinks navItems={[]} isBlogPage={true} />
                <ThemeToggle />
                <ResumeButton />
                <BlogNavOptions 
                  setShowSearch={setShowSearch} 
                  showSearch={showSearch}
                  isMobile={false}
                />
              </div>
            )}
          </nav>
          
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <ResumeButton />
            {isBlogPage && (
              <BlogNavOptions 
                setShowSearch={setShowSearch} 
                showSearch={showSearch}
                isMobile={true}
              />
            )}
            <MobileMenu 
              navItems={navItems}
              isOpen={isOpen}
              toggleMenu={toggleMenu}
              closeMenu={closeMenu}
            />
          </div>
        </div>
      </div>
      
      <SearchBar showSearch={showSearch} />
    </header>
  );
};

export default Navbar;
