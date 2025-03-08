
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading delay for animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <div className="max-w-3xl">
          <span 
            className={`inline-block py-1 px-3 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6 transform ${
              isLoaded ? "opacity-100" : "opacity-0 translate-y-4"
            } transition-all duration-700 delay-100`}
          >
            Welcome to my portfolio
          </span>
          
          <h1 
            className={`text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 transform ${
              isLoaded ? "opacity-100" : "opacity-0 translate-y-4"
            } transition-all duration-700 delay-200`}
          >
            Crafting Digital<br />
            <span className="text-primary">Experiences</span> with Passion
          </h1>
          
          <p 
            className={`text-muted-foreground text-lg md:text-xl max-w-2xl mb-8 transform ${
              isLoaded ? "opacity-100" : "opacity-0 translate-y-4"
            } transition-all duration-700 delay-300`}
          >
            I'm a developer and designer focused on creating intuitive, 
            user-centered digital solutions that combine aesthetics with functionality.
          </p>
          
          <div 
            className={`flex flex-wrap gap-4 transform ${
              isLoaded ? "opacity-100" : "opacity-0 translate-y-4"
            } transition-all duration-700 delay-400`}
          >
            <Link 
              to="/projects" 
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 group"
            >
              View My Work
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/about" 
              className="px-6 py-3 rounded-lg border border-border hover:bg-accent transition-colors font-medium"
            >
              About Me
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
