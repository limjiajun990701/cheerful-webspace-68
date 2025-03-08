
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Preview */}
            <div className="bg-background rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">About Me</h3>
              <p className="text-muted-foreground mb-6">
                Learn more about my background, skills, and what drives me to create exceptional digital experiences.
              </p>
              <Link 
                to="/about" 
                className="inline-flex items-center text-primary hover:underline gap-1 group"
              >
                Discover more
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Experience Preview */}
            <div className="bg-background rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Experience</h3>
              <p className="text-muted-foreground mb-6">
                Explore my professional journey, including roles, projects, and the valuable skills I've developed along the way.
              </p>
              <Link 
                to="/experience" 
                className="inline-flex items-center text-primary hover:underline gap-1 group"
              >
                View experience
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Projects Preview */}
            <div className="bg-background rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Projects</h3>
              <p className="text-muted-foreground mb-6">
                Browse through my portfolio of work showcasing my technical abilities and creative problem-solving.
              </p>
              <Link 
                to="/projects" 
                className="inline-flex items-center text-primary hover:underline gap-1 group"
              >
                See projects
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Latest from the Blog</h2>
              <p className="text-muted-foreground max-w-lg">
                Read my thoughts on development, design, and technology trends.
              </p>
            </div>
            <Link 
              to="/blog" 
              className="px-5 py-2.5 rounded-lg border border-border hover:bg-accent transition-colors font-medium"
            >
              View All Posts
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog post previews will go here */}
            <div className="bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video bg-muted" />
              <div className="p-6">
                <div className="flex items-center text-xs text-muted-foreground mb-3">
                  <span>April 15, 2023</span>
                  <span className="mx-2">•</span>
                  <span>Development</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Getting Started with React and TypeScript</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  A comprehensive guide to setting up a new project with React and TypeScript for better development experience.
                </p>
                <Link 
                  to="/blog/1" 
                  className="inline-flex items-center text-primary hover:underline gap-1 group"
                >
                  Read more
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video bg-muted" />
              <div className="p-6">
                <div className="flex items-center text-xs text-muted-foreground mb-3">
                  <span>March 22, 2023</span>
                  <span className="mx-2">•</span>
                  <span>Design</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Designing User-Centered Interfaces</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  Explore the principles of user-centered design and how to apply them to create more intuitive interfaces.
                </p>
                <Link 
                  to="/blog/2" 
                  className="inline-flex items-center text-primary hover:underline gap-1 group"
                >
                  Read more
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
            Interested in collaborating or have a project in mind? I'm always open to discussing new opportunities.
          </p>
          <Link 
            to="/about#contact" 
            className="px-6 py-3 rounded-lg bg-white text-primary font-medium hover:bg-white/90 transition-colors inline-flex items-center gap-2"
          >
            Get in Touch
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground mb-4 md:mb-0">
              © 2023 Portfolio. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
