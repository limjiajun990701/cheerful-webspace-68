
import React, { useEffect, useState } from "react";
import DynamicHero from "../components/DynamicHero";
import CertificationsSection from "../components/CertificationsSection";
import { ArrowRight, Database, Code, Server, Smartphone, Layout, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { getExpertiseContent } from "@/utils/contentUtils";

interface ExpertiseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const Index = () => {
  const [expertise, setExpertise] = useState({
    title: 'My Expertise',
    subtitle: 'I specialize in full-stack development with experience in both mobile and web technologies.',
    skills: [
      { name: "Flutter", color: "bg-blue-100 text-blue-800" },
      { name: "Vue.js", color: "bg-green-100 text-green-800" },
      { name: "Java", color: "bg-orange-100 text-orange-800" },
      { name: "TypeScript", color: "bg-indigo-100 text-indigo-800" },
      { name: "PHP", color: "bg-purple-100 text-purple-800" },
      { name: "AWS", color: "bg-yellow-100 text-yellow-800" },
      { name: "Azure", color: "bg-blue-100 text-blue-800" },
      { name: "MySQL", color: "bg-cyan-100 text-cyan-800" },
    ],
    items: [
      {
        id: "1",
        title: "Mobile Development",
        description: "Building responsive and feature-rich mobile applications using Flutter and native technologies.",
        icon: "smartphone"
      },
      {
        id: "2",
        title: "Frontend Development",
        description: "Creating responsive and intuitive user interfaces with Vue.js, TypeScript, and modern web technologies.",
        icon: "layout"
      },
      {
        id: "3",
        title: "Backend Development",
        description: "Building robust server-side applications and APIs using Java, PHP, and database technologies.",
        icon: "server"
      }
    ]
  });

  useEffect(() => {
    const fetchExpertiseContent = async () => {
      try {
        const data = await getExpertiseContent();
        
        if (data) {
          // Parse description field as JSON
          let parsedItems = [];
          let parsedSkills = [];
          
          try {
            const descData = JSON.parse(data.description || '{}');
            parsedItems = descData.items || [];
            parsedSkills = descData.skills || [];
          } catch (e) {
            console.error('Error parsing expertise JSON:', e);
          }
          
          if (parsedItems.length && parsedSkills.length) {
            // Create skill colors
            const skillsWithColors = parsedSkills.map((skill: string, index: number) => {
              const colorOptions = [
                "bg-blue-100 text-blue-800",
                "bg-green-100 text-green-800",
                "bg-orange-100 text-orange-800",
                "bg-indigo-100 text-indigo-800",
                "bg-purple-100 text-purple-800",
                "bg-yellow-100 text-yellow-800",
                "bg-cyan-100 text-cyan-800",
                "bg-red-100 text-red-800",
              ];
              
              return {
                name: skill,
                color: colorOptions[index % colorOptions.length]
              };
            });
            
            setExpertise({
              title: data.title || 'My Expertise',
              subtitle: data.subtitle || 'I specialize in full-stack development with experience in both mobile and web technologies.',
              skills: skillsWithColors,
              items: parsedItems
            });
          }
        }
      } catch (error) {
        console.error('Error fetching expertise content:', error);
      }
    };
    
    fetchExpertiseContent();
  }, []);

  // Function to render the appropriate icon
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'smartphone': return <Smartphone />;
      case 'code': return <Code />;
      case 'layout': return <Layout />;
      case 'database': return <Database />;
      case 'server': return <Server />;
      case 'globe': return <Globe />;
      default: return <Code />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DynamicHero />

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">{expertise.title}</h2>
            <p className="text-muted-foreground text-lg">
              {expertise.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {expertise.skills.map((skill, index) => (
              <span 
                key={index} 
                className={`px-4 py-2 rounded-full text-sm font-medium ${skill.color}`}
              >
                {skill.name}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {expertise.items.map((item) => (
              <div key={item.id} className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <div className="text-primary">
                    {renderIcon(item.icon)}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
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
