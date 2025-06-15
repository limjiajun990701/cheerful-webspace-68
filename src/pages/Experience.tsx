import React, { useState, useEffect } from 'react';
import { BriefcaseIcon, GraduationCap } from "lucide-react";
import ExperienceCard from "../components/ExperienceCard";
import DynamicHeader from "../components/experience/DynamicHeader";
import { supabase } from "@/integrations/supabase/client";

interface ExperienceItem {
  id: string;
  type: 'work' | 'education';
  title: string;
  company: string;
  location: string | null;
  date: string | null;
  description: string;
}

const Experience = () => {
  const [experienceData, setExperienceData] = useState<ExperienceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Default data as fallback with simplified properties
  const defaultExperienceData: ExperienceItem[] = [
    {
      id: "default-1",
      title: "Flutter Developer",
      company: "K NET LAB SDN. BHD.",
      location: "Malaysia",
      date: "July 2024 - December 2024",
      description: 
        "Collaborated on the development and enhancement of the Linksay social chat app, focusing on multimedia sharing and user experience improvements. Contributed to UI enhancements, bug fixes, and integration of Web3 wallet and blockchain token functionality. Led the implementation of key features that improved user retention metrics and app performance on low-end devices.",
      type: "work",
    },
    {
      id: "default-2",
      title: "Software Engineer Intern",
      company: "SIM IT SDN BHD",
      location: "Malaysia",
      date: "October 2023 - April 2024",
      description: 
        "Designed and developed microservices APIs, enhanced reporting systems by improving template functionality, and built full-stack solutions leveraging modern frameworks and database technologies. Projects included microservices API development, PHPJasper report development, and a fullstack hostel report system using Vue.js, TypeScript, Quarkus, and MariaDB. Worked closely with cross-functional teams to ensure all deliverables met business requirements while maintaining high code quality standards.",
      type: "work",
    },
    {
      id: "default-3",
      title: "Bachelor of Science with Honours (Information Technology)",
      company: "Universiti Utara Malaysia (UUM)",
      location: "Sintok, Kedah",
      date: "October 2020 - September 2024",
      description: 
        "Specialized in Software Engineering with a CGPA of 3.34/4.00. Developed strong foundations in software development principles, programming languages, and system design methodologies. Participated in multiple hackathons and coding competitions, securing top positions. Completed capstone project on cloud-based solutions for small businesses.",
      type: "education",
    },
    {
      id: "default-4",
      title: "STPM",
      company: "KOLEJ TINGKATAN ENAM PONTIAN",
      location: "Pontian, Johor",
      date: "January 2018 - December 2019",
      description: 
        "Completed pre-university education, establishing strong academic foundations before pursuing higher education in Information Technology. Focused on science and mathematics subjects with additional coursework in computer literacy.",
      type: "education",
    },
  ];

  useEffect(() => {
    const fetchExperiences = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching experiences:", error);
        setExperienceData(defaultExperienceData);
      } else if (data && data.length > 0) {
        setExperienceData(data);
      } else {
        setExperienceData(defaultExperienceData);
      }
      setIsLoading(false);
    };
    
    fetchExperiences();
  }, []);

  // Separate work and education experiences
  const workExperience = experienceData.filter(exp => exp.type === "work");
  const education = experienceData.filter(exp => exp.type === "education");

  // Quick jump navigation - scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 lg:py-24 overflow-x-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Background gradient effect */}
          <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-primary/5 to-transparent -z-10 blur-3xl"></div>
          
          <DynamicHeader />
          
          {/* Quick jump navigation */}
          <div className="mb-10 flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('work-section')}
              className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center gap-2 transition-all"
            >
              <BriefcaseIcon className="w-4 h-4" />
              Work Experience
            </button>
            <button 
              onClick={() => scrollToSection('education-section')}
              className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center gap-2 transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              Education
            </button>
          </div>
          
          <div className="space-y-16 reveal">
            <section id="work-section" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-10 flex items-center gap-2 reveal reveal-delay-1">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <BriefcaseIcon className="w-4 h-4 text-primary" />
                </span>
                Professional Experience
              </h2>
              
              <div className="ml-4">
                {workExperience.length > 0 ? (
                  workExperience.map((experience, index) => (
                    <div key={experience.id} className={`reveal reveal-delay-${index + 2}`}>
                      <ExperienceCard
                        title={experience.title}
                        company={experience.company}
                        location={experience.location}
                        date={experience.date}
                        description={experience.description}
                        type={experience.type}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No work experience entries found. Add some from the admin panel.
                  </p>
                )}
              </div>
            </section>
            
            <section id="education-section" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-10 flex items-center gap-2 reveal reveal-delay-1">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </span>
                Education
              </h2>
              
              <div className="ml-4">
                {education.length > 0 ? (
                  education.map((experience, index) => (
                    <div key={experience.id} className={`reveal reveal-delay-${index + 2}`}>
                      <ExperienceCard
                        title={experience.title}
                        company={experience.company}
                        location={experience.location}
                        date={experience.date}
                        description={experience.description}
                        type={experience.type}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No education entries found. Add some from the admin panel.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
