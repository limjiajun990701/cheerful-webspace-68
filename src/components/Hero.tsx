import { useState, useEffect } from "react";
import { ArrowRight, Github, Linkedin, Mail, Phone } from "lucide-react";
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
            Software Engineer
          </span>
          
          <h1 
            className={`text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 transform ${
              isLoaded ? "opacity-100" : "opacity-0 translate-y-4"
            } transition-all duration-700 delay-200`}
          >
            LIM JIA<br />
            <span className="text-primary">JUN</span>
          </h1>
          
          <p 
            className={`text-muted-foreground text-lg md:text-xl max-w-2xl mb-8 transform ${
              isLoaded ? "opacity-100" : "opacity-0 translate-y-4"
            } transition-all duration-700 delay-300`}
          >
            Fresh graduate with a Bachelor's Degree in Information Technology specializing in 
            Software Engineering. Focused on full-stack development with expertise in Flutter, 
            Vue.js, and Java.
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
          
          <div 
            className={`flex mt-10 gap-4 transform ${
              isLoaded ? "opacity-100" : "opacity-0 translate-y-4"
            } transition-all duration-700 delay-500`}
          >
            <a 
              href="https://github.com/LIMJIAJUN" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-accent hover:bg-primary/10 transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://linkedin.com/in/LIMJIAJUN" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-accent hover:bg-primary/10 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="mailto:jiajunlim0701@gmail.com" 
              className="p-2 rounded-full bg-accent hover:bg-primary/10 transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
            <a 
              href="tel:+60 1128797556" 
              className="p-2 rounded-full bg-accent hover:bg-primary/10 transition-colors"
              aria-label="Phone"
            >
              <Phone size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
