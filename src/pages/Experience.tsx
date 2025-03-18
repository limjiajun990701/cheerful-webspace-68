
import { BriefcaseIcon, GraduationCap } from "lucide-react";
import ExperienceCard from "../components/ExperienceCard";

const experienceData = [
  {
    id: 1,
    title: "Flutter Developer",
    company: "K NET LAB SDN. BHD.",
    location: "Malaysia",
    date: "July 2024 - December 2024",
    description: 
      "Collaborated on the development and enhancement of the Linksay social chat app, focusing on multimedia sharing and user experience improvements. Contributed to UI enhancements, bug fixes, and integration of Web3 wallet and blockchain token functionality.",
    type: "work" as const,
  },
  {
    id: 2,
    title: "Software Engineer Intern",
    company: "SIM IT SDN BHD",
    location: "Malaysia",
    date: "October 2023 - April 2024",
    description: 
      "Designed and developed microservices APIs, enhanced reporting systems by improving template functionality, and built full-stack solutions leveraging modern frameworks and database technologies. Projects included microservices API development, PHPJasper report development, and a fullstack hostel report system using Vue.js, TypeScript, Quarkus, and MariaDB.",
    type: "work" as const,
  },
  {
    id: 3,
    title: "Bachelor of Science with Honours (Information Technology)",
    company: "Universiti Utara Malaysia (UUM)",
    location: "Sintok, Kedah",
    date: "October 2020 - September 2024",
    description: 
      "Specialized in Software Engineering with a CGPA of 3.34/4.00. Developed strong foundations in software development principles, programming languages, and system design methodologies.",
    type: "education" as const,
  },
  {
    id: 4,
    title: "STPM",
    company: "KOLEJ TINGKATAN ENAM PONTIAN",
    location: "Pontian, Johor",
    date: "",
    description: 
      "Completed pre-university education, establishing strong academic foundations before pursuing higher education in Information Technology.",
    type: "education" as const,
  },
];

const Experience = () => {
  // Separate work and education experiences
  const workExperience = experienceData.filter(exp => exp.type === "work");
  const education = experienceData.filter(exp => exp.type === "education");

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-6 mb-16 animate-fade-in">
            <span className="text-sm font-medium text-primary">My Journey</span>
            <h1 className="text-4xl md:text-5xl font-bold">Experience & Education</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              A chronological overview of my professional experience and educational background.
            </p>
          </div>
          
          <div className="space-y-16">
            <section>
              <h2 className="text-2xl font-bold mb-10 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <BriefcaseIcon className="w-4 h-4 text-primary" />
                </span>
                Professional Experience
              </h2>
              
              <div className="ml-4">
                {workExperience.map((experience) => (
                  <ExperienceCard
                    key={experience.id}
                    title={experience.title}
                    company={experience.company}
                    location={experience.location}
                    date={experience.date}
                    description={experience.description}
                    type={experience.type}
                  />
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-10 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </span>
                Education
              </h2>
              
              <div className="ml-4">
                {education.map((experience) => (
                  <ExperienceCard
                    key={experience.id}
                    title={experience.title}
                    company={experience.company}
                    location={experience.location}
                    date={experience.date}
                    description={experience.description}
                    type={experience.type}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
