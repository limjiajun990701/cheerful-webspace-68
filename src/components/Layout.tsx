
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`${isMobile ? 'pt-16 pb-16' : 'pt-20 pb-24'}`}>
        <Outlet />
      </main>
      <footer className="py-10 bg-secondary/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} Lim Jia Jun. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/LIMJIAJUN" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://linkedin.com/in/LIMJIAJUN" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                LinkedIn
              </a>
              <a 
                href="mailto:jiajunlim0701@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
