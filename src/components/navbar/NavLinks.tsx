
import React from 'react';
import { NavLink } from "react-router-dom";

interface NavLinksProps {
  navItems: { name: string; path: string }[];
  isBlogPage?: boolean;
}

const NavLinks = ({ navItems, isBlogPage = false }: NavLinksProps) => {
  if (isBlogPage) {
    return (
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
    );
  }

  return (
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
  );
};

export default NavLinks;
