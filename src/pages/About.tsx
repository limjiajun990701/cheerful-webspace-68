
import React from 'react';
import HeroSection from '@/components/about/HeroSection';
import SkillsSection from '@/components/about/SkillsSection';
import ContactSection from '@/components/about/ContactSection';

const About = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <SkillsSection />
      <ContactSection />
    </div>
  );
};

export default About;
