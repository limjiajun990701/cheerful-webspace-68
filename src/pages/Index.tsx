import React, { useEffect } from "react";
import DynamicHero from "../components/DynamicHero";
import CertificationsSection from "../components/CertificationsSection";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Removed setupSiteImagesBucket call as it's now handled in ContentManager

  const skills = [
    { name: "Flutter", color: "bg-blue-100 text-blue-800" },
    { name: "Vue.js", color: "bg-green-100 text-green-800" },
    { name: "Java", color: "bg-orange-100 text-orange-800" },
    { name: "TypeScript", color: "bg-indigo-100 text-indigo-800" },
    { name: "PHP", color: "bg-purple-100 text-purple-800" },
    { name: "AWS", color: "bg-yellow-100 text-yellow-800" },
    { name: "Azure", color: "bg-blue-100 text-blue-800" },
    { name: "MySQL", color: "bg-cyan-100 text-cyan-800" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <DynamicHero />

      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">My Expertise</h2>
            <p className="text-muted-foreground text-lg">
              I specialize in full-stack development with experience in both mobile and web technologies.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {skills.map((skill, index) => (
              <span 
                key={index} 
                className={`px-4 py-2 rounded-full text-sm font-medium ${skill.color}`}
              >
                {skill.name}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-background rounded-xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  <path d="M13.5 1.5A4.5 4.5 0 0 1 21 9"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Development</h3>
              <p className="text-muted-foreground">
                Building responsive and feature-rich mobile applications using Flutter and native technologies.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M7 7h10"></path>
                  <path d="M7 12h10"></path>
                  <path d="M7 17h10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Frontend Development</h3>
              <p className="text-muted-foreground">
                Creating responsive and intuitive user interfaces with Vue.js, TypeScript, and modern web technologies.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M14 12a4 4 0 0 0-8 0"></path>
                  <path d="M18 8a6 6 0 0 0-12 0"></path>
                  <path d="M22 4a8 8 0 0 0-16 0"></path>
                  <path d="M10 12v7a2 2 0 0 0 4 0v-7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Backend Development</h3>
              <p className="text-muted-foreground">
                Building robust server-side applications and APIs using Java, PHP, and database technologies.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/experience" 
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              View my experience
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      
      <CertificationsSection />
      
      <div className="text-center py-12">
        <Link 
          to="/contact" 
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Contact Me
        </Link>
      </div>
    </div>
  );
};

export default Index;
