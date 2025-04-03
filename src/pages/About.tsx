
import { 
  Github, Mail, Linkedin, Phone, ExternalLink, Code, Globe, Server, 
  Database, Wrench, Zap, Cpu, FileJson, Languages, FileType, BarChart, 
  Coffee, Bookmark, FolderGit, Cloud, Box, Database as DBIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const About = () => {
  // Define skill icons with proper SVG icons where possible
  const skillIcons = {
    // Programming Languages
    "Dart": <img src="https://favicon.is/dart" alt="Dart" className="w-4 h-4" />,
    "JavaScript": <img src="https://favicon.is/javascript" alt="JavaScript" className="w-4 h-4" />,
    "TypeScript": <img src="https://favicon.is/typescript" alt="TypeScript" className="w-4 h-4" />,
    "PHP": <img src="https://favicon.is/php" alt="PHP" className="w-4 h-4" />,
    "Java": <img src="https://favicon.is/java" alt="Java" className="w-4 h-4" />,
    "HTML": <img src="https://favicon.is/html" alt="HTML" className="w-4 h-4" />,
    "CSS": <img src="https://favicon.is/css" alt="CSS" className="w-4 h-4" />,
    
    // Frontend
    "Flutter": <img src="https://favicon.is/flutter" alt="Flutter" className="w-4 h-4" />,
    "Vue.js": <img src="https://favicon.is/vue" alt="Vue.js" className="w-4 h-4" />,
    "React": <img src="https://favicon.is/react" alt="React" className="w-4 h-4" />,
    
    // Backend
    "Quarkus": <img src="https://favicon.is/quarkus" alt="Quarkus" className="w-4 h-4" />,
    
    // Databases
    "MySQL": <img src="https://favicon.is/mysql" alt="MySQL" className="w-4 h-4" />,
    "SQLite": <img src="https://favicon.is/sqlite" alt="SQLite" className="w-4 h-4" />,
    "MariaDB": <img src="https://favicon.is/mariadb" alt="MariaDB" className="w-4 h-4" />,
    "PostgreSQL": <img src="https://favicon.is/postgresql" alt="PostgreSQL" className="w-4 h-4" />,
    
    // Tools & Platforms
    "Git": <img src="https://favicon.is/git" alt="Git" className="w-4 h-4" />,
    "GitLab": <img src="https://favicon.is/gitlab" alt="GitLab" className="w-4 h-4" />,
    "GitHub": <img src="https://favicon.is/github" alt="GitHub" className="w-4 h-4" />,
    "AWS": <img src="https://favicon.is/aws" alt="AWS" className="w-4 h-4" />,
    "Azure": <img src="https://favicon.is/azure" alt="Azure" className="w-4 h-4" />,
    "Oracle Cloud": <img src="https://favicon.is/oracle" alt="Oracle Cloud" className="w-4 h-4" />
  };

  // Add fallback handling for when icons don't load
  const handleImageError = (e, skill) => {
    e.target.onerror = null;
    
    // Use the existing Lucide icons as fallbacks
    const fallbackIcons = {
      // Programming Languages
      "Dart": <Zap className="w-4 h-4" />,
      "JavaScript": <FileJson className="w-4 h-4" />,
      "TypeScript": <FileType className="w-4 h-4" />,
      "PHP": <Code className="w-4 h-4" />,
      "Java": <Coffee className="w-4 h-4" />,
      "HTML": <Languages className="w-4 h-4" />,
      "CSS": <BarChart className="w-4 h-4" />,
      
      // Frontend
      "Flutter": <Box className="w-4 h-4" />,
      "Vue.js": <Bookmark className="w-4 h-4" />,
      "React": <Cpu className="w-4 h-4" />,
      
      // Backend
      "Quarkus": <Server className="w-4 h-4" />,
      
      // Databases
      "MySQL": <DBIcon className="w-4 h-4" />,
      "SQLite": <DBIcon className="w-4 h-4" />,
      "MariaDB": <DBIcon className="w-4 h-4" />,
      "PostgreSQL": <DBIcon className="w-4 h-4" />,
      
      // Tools & Platforms
      "Git": <FolderGit className="w-4 h-4" />,
      "GitLab": <FolderGit className="w-4 h-4" />,
      "GitHub": <Github className="w-4 h-4" />,
      "AWS": <Cloud className="w-4 h-4" />,
      "Azure": <Cloud className="w-4 h-4" />,
      "Oracle Cloud": <Cloud className="w-4 h-4" />
    };
    
    // Replace the img element with the fallback icon
    e.target.parentNode.replaceChild(
      fallbackIcons[skill] || <Code className="w-4 h-4" />, 
      e.target
    );
  };

  const skills = [
    { 
      category: "Programming Languages", 
      icon: <Code className="w-5 h-5 text-primary" />,
      items: ["Dart", "JavaScript", "TypeScript", "PHP", "Java", "HTML", "CSS"] 
    },
    { 
      category: "Frontend", 
      icon: <Globe className="w-5 h-5 text-primary" />,
      items: ["Flutter", "Vue.js", "React"] 
    },
    { 
      category: "Backend", 
      icon: <Server className="w-5 h-5 text-primary" />,
      items: ["PHP", "Java", "Quarkus"] 
    },
    { 
      category: "Databases", 
      icon: <Database className="w-5 h-5 text-primary" />,
      items: ["MySQL", "SQLite", "MariaDB", "PostgreSQL"] 
    },
    { 
      category: "Tools & Platforms", 
      icon: <Wrench className="w-5 h-5 text-primary" />,
      items: ["Git", "GitLab", "GitHub", "AWS", "Azure", "Oracle Cloud"] 
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-6 animate-fade-in">
              <span className="text-sm font-medium text-primary">About Me</span>
              <h1 className="text-4xl md:text-5xl font-bold">
                Hey, I'm <span className="text-primary">Lim Jia Jun</span>
              </h1>
              
              <div className="flex flex-col md:flex-row gap-12 mt-8">
                <div className="md:w-1/3 shrink-0">
                  <div className="rounded-2xl overflow-hidden aspect-square bg-muted relative">
                    {/* Replace with actual profile image */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Profile Image
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <p className="text-lg mb-6">
                    I am a fresh graduate of Universiti Utara Malaysia (UUM) with a Bachelor's Degree in Science with Honours in 
                    Information Technology specializing in Software Engineering.
                  </p>
                  
                  <p className="text-lg mb-6">
                    I'm seeking a challenging position related to Software Engineering and Development, including roles such as 
                    Software Engineer, Software Developer, Frontend Developer, Backend Developer, or Full Stack Developer. 
                  </p>
                  
                  <p className="text-lg">
                    I'm eager to apply my programming skills and knowledge of software engineering principles to contribute to the 
                    design and development of innovative software products.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">My Skills</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {skills.map((skillGroup) => (
                <div 
                  key={skillGroup.category} 
                  className="bg-background rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {skillGroup.icon}
                    <h3 className="text-xl font-semibold">{skillGroup.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill) => (
                      <span 
                        key={skill} 
                        className="px-3 py-1.5 bg-secondary text-foreground rounded-full text-sm flex items-center gap-1.5"
                      >
                        {React.cloneElement(
                          skillIcons[skill], 
                          { 
                            onError: (e) => handleImageError(e, skill)
                          }
                        )}
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section id="contact" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Get in Touch</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Have a project in mind or just want to chat? Feel free to reach out through any of
              the channels below. I'm always open to new opportunities and collaborations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a 
                href="mailto:jiajunlim0701@gmail.com" 
                className="flex items-center gap-4 p-6 rounded-xl border border-border hover:bg-accent transition-colors"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Email</h3>
                  <p className="text-muted-foreground">jiajunlim0701@gmail.com</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground ml-auto" />
              </a>
              
              <a 
                href="tel:+60 1128797556" 
                className="flex items-center gap-4 p-6 rounded-xl border border-border hover:bg-accent transition-colors"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Phone</h3>
                  <p className="text-muted-foreground">+60 1128797556</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground ml-auto" />
              </a>
              
              <a 
                href="https://github.com/LIMJIAJUN" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 rounded-xl border border-border hover:bg-accent transition-colors"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Github className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">GitHub</h3>
                  <p className="text-muted-foreground">github.com/LIMJIAJUN</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground ml-auto" />
              </a>
              
              <a 
                href="https://linkedin.com/in/LIMJIAJUN" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 rounded-xl border border-border hover:bg-accent transition-colors"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Linkedin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">LinkedIn</h3>
                  <p className="text-muted-foreground">linkedin.com/in/LIMJIAJUN</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground ml-auto" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
