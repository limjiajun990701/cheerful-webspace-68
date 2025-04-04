
import React from 'react';

interface SearchBarProps {
  showSearch: boolean;
}

const SearchBar = ({ showSearch }: SearchBarProps) => {
  if (!showSearch) return null;
  
  return (
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
  );
};

export default SearchBar;
