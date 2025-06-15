
import React, { useEffect, useState } from 'react';
import DynamicHeroSection from '@/components/about/DynamicHeroSection';
import ContactSection from '@/components/about/ContactSection';
import TimelineSection from '@/components/about/TimelineSection';
import { getExperienceItems } from "@/utils/contentUtils";

const defaultTimelineItems = [
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
    type: "education",
    title: "Bachelor of Science (Information Technology)",
    company: "Universiti Utara Malaysia (UUM)",
    location: "Sintok, Kedah",
    date: "Oct 2020 - Sept 2024",
    description: "Specialized in Software Engineering, 3.34 CGPA. Involved in hackathons and capstone cloud project for SMEs.",
  },
  {
    id: "default-4",
    type: "education",
    title: "STPM",
    company: "Kolej Tingkatan Enam Pontian",
    location: "Pontian, Johor",
    date: "Jan 2018 - Dec 2019",
    description: "Focused on science/maths. Built academic foundations before university.",
  },
];

const About = () => {
  const [timelineItems, setTimelineItems] = useState(defaultTimelineItems);

  useEffect(() => {
    async function fetchExperiences() {
      const data = await getExperienceItems();
      if (data && data.length > 0) {
        setTimelineItems(data);
      }
    }
    fetchExperiences();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DynamicHeroSection />
      {/* Extra new content for About */}
      <section className="py-10 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4 text-primary">Who Am I?</h2>
        <p className="mb-6 text-lg text-foreground/90">
          Passionate full-stack developer and lifelong learner, focused on impactful results and delivering elegant solutions. I believe in teamwork, growth, and contribution to projects that matter. Outside of coding, I enjoy exploring new tech and creative pursuits.
        </p>
        <div className="flex flex-wrap gap-3">
          <span className="bg-primary/10 text-primary px-4 py-1 rounded-full">Full-stack</span>
          <span className="bg-secondary/40 text-secondary-foreground px-4 py-1 rounded-full">Web & Mobile</span>
          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full">Cloud Dev</span>
          <span className="bg-orange-200 text-orange-700 px-4 py-1 rounded-full">Problem Solver</span>
        </div>
      </section>
      {/* Timeline Section */}
      <TimelineSection items={timelineItems} />
      <ContactSection />
    </div>
  );
};

export default About;
