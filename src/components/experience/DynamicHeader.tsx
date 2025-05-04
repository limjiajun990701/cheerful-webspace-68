
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
    <div className="flex flex-col gap-6 mb-16 animate-fade-in">
      <span className="text-sm font-medium text-primary">
        {content?.subtitle || "My Journey"}
      </span>
      <h1 className="text-4xl md:text-5xl font-bold">
        {content?.title || "Experience & Education"}
      </h1>
      <p className="text-muted-foreground text-lg max-w-2xl">
        {content?.description || "A chronological overview of my professional experience and educational background."}
      </p>
    </div>
  );
};

export default DynamicHeader;
