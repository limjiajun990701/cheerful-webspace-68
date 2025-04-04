
import React from 'react';
import { Code, Database, Server, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SkillsSection = () => {
  const skills = [
    { 
      category: "Programming Languages", 
      items: ["Dart", "JavaScript", "TypeScript", "PHP", "Java", "HTML", "CSS"],
      icon: <Code className="w-5 h-5" />
    },
    { 
      category: "Frontend", 
      items: ["Flutter", "Vue.js", "React"],
      icon: <Code className="w-5 h-5" />
    },
    { 
      category: "Backend", 
      items: ["PHP", "Java", "Quarkus"],
      icon: <Server className="w-5 h-5" />
    },
    { 
      category: "Databases", 
      items: ["MySQL", "SQLite", "MariaDB", "PostgreSQL"],
      icon: <Database className="w-5 h-5" />
    },
    { 
      category: "Tools & Platforms", 
      items: ["Git", "GitLab", "GitHub", "AWS", "Azure", "Oracle Cloud"],
      icon: <Briefcase className="w-5 h-5" />
    },
  ];

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-medium text-primary px-3 py-1 bg-primary/10 rounded-full mb-3">Expertise</span>
            <h2 className="text-3xl font-bold">My Skills</h2>
            <div className="mt-2 h-1 w-20 bg-primary/30 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skillGroup) => (
              <Card 
                key={skillGroup.category} 
                className="border-none shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="h-1 bg-primary/80 w-full"></div>
                <CardContent className="p-6 pt-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-primary transition-transform duration-300 group-hover:scale-110">
                      {skillGroup.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{skillGroup.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {skillGroup.items.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="px-3 py-1.5 text-sm font-medium bg-secondary border border-border/50 hover:bg-secondary/80 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
