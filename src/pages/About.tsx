import React, { useEffect, useState } from 'react';
import DynamicHeroSection from '@/components/about/DynamicHeroSection';
import ContactSection from '@/components/about/ContactSection';
import TimelineSection from '@/components/about/TimelineSection';
import { supabase } from "@/integrations/supabase/client";
import { TimelineItem } from '@/types/TimelineItem';
import { useScrollReveal } from '@/hooks/useScrollReveal';

// TimelineItem type
// type TimelineItem = {
//   id: string;
//   type: "work" | "education";
//   title: string;
//   company: string;
//   location: string | null;
//   date: string | null;
//   description: string;
// };

type AboutSection = {
  id: string;
  section_key: string;
  title: string | null;
  body: string | null;
  tags: string[] | null;
  updated_at: string;
};

const defaultTimelineItems: TimelineItem[] = [
  {
    id: "default-1",
    type: "work",
    title: "Flutter Developer",
    company: "K NET LAB SDN. BHD.",
    location: "Malaysia",
    date: "July 2024 - December 2024",
    description: "Worked on Linksay chat app: multimedia sharing, UI/UX, Web3 wallet, blockchain token integration, and performance optimization for low-end devices.",
  },
  {
    id: "default-2",
    type: "work",
    title: "Software Engineer Intern",
    company: "SIM IT SDN BHD",
    location: "Malaysia",
    date: "October 2023 - April 2024",
    description: "Developed microservices APIs, PHPJasper reports, and fullstack systems using Vue.js, Quarkus, MariaDB. Delivered high quality code with business alignment.",
  },
  {
    id: "default-3",
    type: "work",
    title: "Bachelor of Science (Information Technology)",
    company: "Universiti Utara Malaysia (UUM)",
    location: "Sintok, Kedah",
    date: "Oct 2020 - Sept 2024",
    description: "Specialized in Software Engineering, 3.34 CGPA. Involved in hackathons and capstone cloud project for SMEs.",
  },
  {
    id: "default-4",
    type: "work",
    title: "STPM",
    company: "Kolej Tingkatan Enam Pontian",
    location: "Pontian, Johor",
    date: "Jan 2018 - Dec 2019",
    description: "Focused on science/maths. Built academic foundations before university.",
  },
];

const defaultAboutSection: AboutSection = {
  id: "default",
  section_key: "who_am_i",
  title: "Who Am I?",
  body: "Passionate full-stack developer and lifelong learner, focused on impactful results and delivering elegant solutions. I believe in teamwork, growth, and contribution to projects that matter. Outside of coding, I enjoy exploring new tech and creative pursuits.",
  tags: ["Full-stack", "Web & Mobile", "Cloud Dev", "Problem Solver"],
  updated_at: "",
};

const About = () => {
  // Scroll reveal hooks for different sections
  const heroReveal = useScrollReveal({ threshold: 0.2, triggerOnce: true });
  const aboutSectionReveal = useScrollReveal({ threshold: 0.3, triggerOnce: true });
  const workTimelineReveal = useScrollReveal({ threshold: 0.2, triggerOnce: true });
  const educationTimelineReveal = useScrollReveal({ threshold: 0.2, triggerOnce: true });
  const contactReveal = useScrollReveal({ threshold: 0.2, triggerOnce: true });

  const [workItems, setWorkItems] = useState<TimelineItem[]>([]);
  const [educationItems, setEducationItems] = useState<TimelineItem[]>([]);
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);

  // Fetch work experiences
  useEffect(() => {
    async function fetchWork() {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('type', 'work')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setWorkItems(
          data.map((item: any) => ({
            id: item.id,
            type: "work",
            title: item.title,
            company: item.company,
            location: item.location,
            date: item.date,
            description: item.description,
          }))
        );
      } else {
        setWorkItems([]);
      }
    }
    fetchWork();
  }, []);

  // Fetch education experiences
  useEffect(() => {
    async function fetchEducation() {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('type', 'education')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setEducationItems(
          data.map((item: any) => ({
            id: item.id,
            type: "work", // still uses the TimelineItem interface which expects only 'work' for type
            title: item.title,
            company: item.company,
            location: item.location,
            date: item.date,
            description: item.description,
          }))
        );
      } else {
        setEducationItems([]);
      }
    }
    fetchEducation();
  }, []);

  // Fetch about section, do not fallback to hardcoded on null
  useEffect(() => {
    async function fetchAboutSection() {
      const { data, error } = await supabase
        .from('about_sections')
        .select('*')
        .eq('section_key', 'who_am_i')
        .maybeSingle();
      if (data) {
        setAboutSection(data);
      } else {
        setAboutSection(null); // do NOT fallback to hardcode
      }
    }
    fetchAboutSection();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* About Hero with scroll animation */}
      <div ref={heroReveal.ref} className={`transition-all duration-1000 ease-out ${
        heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <DynamicHeroSection />
      </div>

      {/* Editable Who Am I Section with scroll animation */}
      <section 
        ref={aboutSectionReveal.ref}
        className={`py-10 max-w-3xl mx-auto px-4 transition-all duration-1000 ease-out ${
          aboutSectionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div className={`transform transition-all duration-800 ${
          aboutSectionReveal.isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`} style={{ transitionDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold mb-4 text-primary animate-slide-up">
            {aboutSection?.title ?? ""}
          </h2>
          <p className="mb-6 text-lg text-foreground/90 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {aboutSection?.body ?? ""}
          </p>
          <div className="flex flex-wrap gap-3">
            {(aboutSection?.tags ?? []).map((tag: string, index: number) => (
              <span 
                key={tag} 
                className={`bg-primary/10 text-primary px-4 py-1 rounded-full transform transition-all duration-500 hover:scale-105 ${
                  aboutSectionReveal.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
                style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - Work with enhanced scroll animation */}
      <div ref={workTimelineReveal.ref} className={`transition-all duration-1000 ease-out ${
        workTimelineReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
        <TimelineSection items={workItems} sectionTitle="Work Experience" />
      </div>

      {/* Timeline - Education with enhanced scroll animation */}
      <div ref={educationTimelineReveal.ref} className={`transition-all duration-1000 ease-out ${
        educationTimelineReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
        <TimelineSection items={educationItems} sectionTitle="Education" />
      </div>

      {/* Contact with scroll animation */}
      <div ref={contactReveal.ref} className={`transition-all duration-1000 ease-out ${
        contactReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
        <ContactSection />
      </div>
    </div>
  );
};

export default About;
