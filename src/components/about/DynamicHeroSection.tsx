
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { getSiteContent } from "@/utils/contentUtils";
import { useToast } from "@/hooks/use-toast";

interface AboutHeroContent {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
}

const DynamicHeroSection = () => {
  const { toast } = useToast();
  const [content, setContent] = useState<AboutHeroContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getSiteContent('about', 'hero');
        if (data) {
          setContent(data);
        } else {
          console.error("Failed to fetch about hero content");
          toast({
            title: "Content Not Found",
            description: "About page content could not be loaded",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
        toast({
          title: "Error",
          description: "Failed to load about content",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [toast]);

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="space-y-2">
              <span className="inline-block text-sm font-medium text-primary px-3 py-1 bg-primary/10 rounded-full">
                {content?.subtitle || "About Me"}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold">
                Hey, I'm <span className="text-primary relative">
                  {content?.title?.split(' ').slice(1).join(' ') || "Lim Jia Jun"}
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30 -z-10"></span>
                </span>
              </h1>
            </div>
            
            <div className="mt-10">
              <div className="w-full">
                <div className="space-y-6">
                  {content?.description ? (
                    <div dangerouslySetInnerHTML={{ 
                      __html: content.description
                        .split('\n')
                        .map(paragraph => `<p class="text-lg leading-relaxed">${paragraph}</p>`)
                        .join('') 
                    }} />
                  ) : (
                    <>
                      <p className="text-lg leading-relaxed">
                        I am a fresh graduate of Universiti Utara Malaysia (UUM) with a Bachelor's Degree in Science with Honours in 
                        Information Technology specializing in Software Engineering.
                      </p>
                      
                      <p className="text-lg leading-relaxed">
                        I'm seeking a challenging position related to Software Engineering and Development, including roles such as 
                        Software Engineer, Software Developer, Frontend Developer, Backend Developer, or Full Stack Developer. 
                      </p>
                      
                      <p className="text-lg leading-relaxed">
                        I'm eager to apply my programming skills and knowledge of software engineering principles to contribute to the 
                        design and development of innovative software products.
                      </p>
                    </>
                  )}
                </div>
                
                <div className="mt-8">
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group"
                  >
                    Get in Touch
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1">
                      <path d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicHeroSection;
