
import { Github, Mail, Linkedin, Phone, ExternalLink } from "lucide-react";

const About = () => {
  const skills = [
    { category: "Languages", items: ["JavaScript", "TypeScript", "HTML", "CSS", "Python"] },
    { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Redux", "GraphQL"] },
    { category: "Backend", items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Firebase"] },
    { category: "Tools", items: ["Git", "Docker", "AWS", "Figma", "Jest"] },
  ];

  return (
    <div className="min-h-screen">
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-6 animate-fade-in">
              <span className="text-sm font-medium text-primary">About Me</span>
              <h1 className="text-4xl md:text-5xl font-bold">
                Hey, I'm <span className="text-primary">John Doe</span>
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
                    I'm a passionate full-stack developer with over 5 years of experience building
                    web applications. My journey in software development started with a curiosity
                    about how websites work, which evolved into a career creating digital
                    experiences that are both functional and beautiful.
                  </p>
                  
                  <p className="text-lg mb-6">
                    I specialize in JavaScript and TypeScript ecosystems, with expertise in React
                    for frontend development and Node.js for backend services. My approach combines
                    technical knowledge with an eye for design, ensuring that the applications I
                    build are not only robust but also intuitive for users.
                  </p>
                  
                  <p className="text-lg">
                    When I'm not coding, you'll find me exploring new technologies, contributing to
                    open-source projects, or enjoying outdoor activities like hiking and
                    photography.
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
                  <h3 className="text-xl font-semibold mb-4">{skillGroup.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill) => (
                      <span 
                        key={skill} 
                        className="px-3 py-1.5 bg-secondary text-foreground rounded-full text-sm"
                      >
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
                href="mailto:hello@example.com" 
                className="flex items-center gap-4 p-6 rounded-xl border border-border hover:bg-accent transition-colors"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Email</h3>
                  <p className="text-muted-foreground">hello@example.com</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground ml-auto" />
              </a>
              
              <a 
                href="tel:+1234567890" 
                className="flex items-center gap-4 p-6 rounded-xl border border-border hover:bg-accent transition-colors"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Phone</h3>
                  <p className="text-muted-foreground">+1 (234) 567-890</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground ml-auto" />
              </a>
              
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 rounded-xl border border-border hover:bg-accent transition-colors"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Github className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">GitHub</h3>
                  <p className="text-muted-foreground">github.com/johndoe</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground ml-auto" />
              </a>
              
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 rounded-xl border border-border hover:bg-accent transition-colors"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Linkedin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">LinkedIn</h3>
                  <p className="text-muted-foreground">linkedin.com/in/johndoe</p>
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
