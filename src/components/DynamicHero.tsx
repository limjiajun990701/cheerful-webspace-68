
import { useState, useEffect } from "react";
import { ArrowRight, Github, Linkedin, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { getSiteContent } from "@/utils/contentUtils";
import { useToast } from "@/hooks/use-toast";

interface HeroContent {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
}

const DynamicHero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [content, setContent] = useState<HeroContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getSiteContent('home', 'hero');
        if (data) {
          setContent(data);
          setImageError(false);
        } else {
          console.error("Home hero content not found");
        }
      } catch (error) {
        console.error("Error fetching home content:", error);
        toast({
          title: "Error",
          description: "Failed to load home content",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
    
    // Simulate loading delay for animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [toast]);

  const handleImageError = () => {
    setImageError(true);
    console.error("Failed to load hero image:", content?.image_url);
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        {content?.image_url && !imageError && (
          <div className="absolute inset-0 opacity-10">
            <img 
              src={content.image_url} 
              alt="Background" 
              className="w-full h-full object-cover"
              onError={handleImageError} 
            />
          </div>
        )}
        
        {/* Debug info - visible to admins only */}
        {import.meta.env.DEV && content?.image_url && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs p-1 rounded">
            Image URL: {content.image_url.substring(0, 30)}...
          </div>
        )}
      </div>
      
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <div className="max-w-3xl">
          <span 
            className={`inline-block py-1 px-3 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6 transform ${
              isLoaded ? "opacity-100" : "opacity-0 translate-y-4"
            } transition-all duration-700 delay-100`}
          >
            {content?.subtitle || "Software Engineer"}
          </span>
          
          <h1 
            className={`text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 transform ${
              isLoaded ? "opacity-100" : "opacity-0 translate-y-4"
            } transition-all duration-700 delay-200`}
          >
            {content?.title || "LIM JIA JUN"}
          </h1>
          
          <p 
            className={`text-muted-foreground text-lg md:text-xl max-w-2xl mb-8 transform ${
              isLoaded ? "opacity-100" : "opacity-0 translate-y-4"
            } transition-all duration-700 delay-300`}
          >
            {content?.description || 
              "Fresh graduate with a Bachelor's Degree in Information Technology specializing in Software Engineering. Focused on full-stack development with expertise in Flutter, Vue.js, and Java."}
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

export default DynamicHero;
