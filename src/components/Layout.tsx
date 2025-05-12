
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pt-20 ${isMobile ? 'pb-16' : 'pb-24'}`}>
        <Outlet />
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Lim Jia Jun. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
