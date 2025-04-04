
import React from 'react';
import { NavLink } from "react-router-dom";
import { X, Menu } from "lucide-react";

interface MobileMenuProps {
  navItems: { name: string; path: string }[];
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

const MobileMenu = ({ navItems, isOpen, toggleMenu, closeMenu }: MobileMenuProps) => {
  return (
    <>
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg text-foreground hover:bg-accent smooth-transition"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
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
    </>
  );
};

export default MobileMenu;
