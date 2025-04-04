
import React from 'react';
import { User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="space-y-2">
              <span className="inline-block text-sm font-medium text-primary px-3 py-1 bg-primary/10 rounded-full">About Me</span>
              <h1 className="text-4xl md:text-5xl font-bold">
                Hey, I'm <span className="text-primary relative">
                  Lim Jia Jun
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30 -z-10"></span>
                </span>
              </h1>
            </div>
            
            <div className="flex flex-col md:flex-row gap-12 mt-10">
              <div className="md:w-1/3 shrink-0">
                <div className="rounded-2xl overflow-hidden aspect-square bg-secondary relative shadow-lg transform transition-transform hover:scale-[1.02] hover:shadow-xl">
                  {/* Replace with actual profile image */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/5 to-primary/20">
                    <User className="w-20 h-20 text-primary/40" />
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <div className="space-y-6">
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
                </div>
                
                <div className="mt-8">
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group"
                  >
                    Get in Touch
                    <ExternalLink className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
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

export default HeroSection;
