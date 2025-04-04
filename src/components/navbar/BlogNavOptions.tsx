
import React from 'react';
import { NavLink } from "react-router-dom";
import { Search, Rss } from "lucide-react";

interface BlogNavOptionsProps {
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  showSearch: boolean;
  isMobile: boolean;
}

const BlogNavOptions = ({ setShowSearch, showSearch, isMobile }: BlogNavOptionsProps) => {
  return (
    <>
      <button
        onClick={() => setShowSearch(!showSearch)}
        className={`p-2 ${isMobile ? 'mr-2' : ''} rounded-${isMobile ? 'lg' : 'full'} text-foreground hover:bg-accent smooth-transition`}
        aria-label="Search blog"
      >
        <Search size={isMobile ? 20 : 18} />
      </button>
      
      {!isMobile && (
        <button
          onClick={() => {}}
          className="p-2 rounded-full text-foreground hover:bg-accent smooth-transition"
          aria-label="RSS Feed"
        >
          <Rss size={18} />
        </button>
      )}
    </>
  );
};

export default BlogNavOptions;
