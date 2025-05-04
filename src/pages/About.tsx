
import React from 'react';
import DynamicHeroSection from '@/components/about/DynamicHeroSection';
import DynamicSkillsSection from '@/components/about/DynamicSkillsSection';
import ContactSection from '@/components/about/ContactSection';

const About = () => {
  return (
    <div className="min-h-screen">
      <DynamicHeroSection />
      <DynamicSkillsSection />
      <ContactSection />
    </div>
  );
};

export default About;
