
import React from 'react';
import { 
  Github, Mail, Linkedin, Phone, ExternalLink, 
  User, Code, Database, Server, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const About = () => {
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
    <div className="min-h-screen">
      {/* Hero Section */}
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
      
      {/* Skills Section */}
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
                  className="border-none shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="h-1 bg-primary/80 w-full"></div>
                  <CardContent className="p-6 pt-5">
                    <div className="flex items-center gap-2 mb-4">
                      {skillGroup.icon}
                      <h3 className="text-xl font-semibold">{skillGroup.category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {skillGroup.items.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary"
                          className="px-3 py-1.5 text-sm font-medium bg-secondary border border-border/50 hover:bg-secondary/80"
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
      
      {/* Contact Section */}
      <section id="contact" className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-sm font-medium text-primary px-3 py-1 bg-primary/10 rounded-full mb-3">Contact</span>
              <h2 className="text-3xl font-bold">Get in Touch</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Have a project in mind or just want to chat? Feel free to reach out through any of
                the channels below. I'm always open to new opportunities and collaborations.
              </p>
              <div className="mt-3 h-1 w-20 bg-primary/30 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a 
                href="mailto:jiajunlim0701@gmail.com" 
                className="group flex items-center gap-4 p-6 rounded-xl border border-border hover:bg-accent transition-colors overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors relative z-10">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-medium">Email</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors">jiajunlim0701@gmail.com</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground ml-auto relative z-10 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="tel:+60 1128797556" 
                className="group flex items-center gap-4 p-6 rounded-xl border border-border hover:bg-accent transition-colors overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors relative z-10">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-medium">Phone</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors">+60 1128797556</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground ml-auto relative z-10 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="https://github.com/LIMJIAJUN" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-6 rounded-xl border border-border hover:bg-accent transition-colors overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors relative z-10">
                  <Github className="w-6 h-6 text-primary" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-medium">GitHub</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors">github.com/LIMJIAJUN</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground ml-auto relative z-10 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="https://linkedin.com/in/LIMJIAJUN" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-6 rounded-xl border border-border hover:bg-accent transition-colors overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors relative z-10">
                  <Linkedin className="w-6 h-6 text-primary" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-medium">LinkedIn</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors">linkedin.com/in/LIMJIAJUN</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground ml-auto relative z-10 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
