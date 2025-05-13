
import React, { useState, useEffect } from 'react';
import { getSiteContent } from "@/utils/contentUtils";

interface ExperienceHeaderContent {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
}

const DynamicHeader = () => {
  const [content, setContent] = useState<ExperienceHeaderContent | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const data = await getSiteContent('experience', 'header');
      if (data) {
        setContent(data);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="relative flex flex-col gap-6 mb-16 z-10">
      {/* Animated gradient background */}
      <div className="absolute -z-10 inset-0 overflow-hidden">
        <div className="absolute -inset-[100%] bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 opacity-80 blur-3xl animate-slow-move"></div>
      </div>
      
      <span className="text-sm font-medium text-primary animate-fade-in">
        {content?.subtitle || "My Journey"}
      </span>
      <h1 className="text-4xl md:text-5xl font-bold animate-fade-in">
        {content?.title || "Experience & Education"}
      </h1>
      <p className="text-muted-foreground text-lg max-w-2xl animate-fade-in">
        {content?.description || "A chronological overview of my professional experience and educational background."}
      </p>
    </div>
  );
};

export default DynamicHeader;
