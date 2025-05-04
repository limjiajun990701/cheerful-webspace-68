
import React from 'react';
import DynamicHeroSection from '@/components/about/DynamicHeroSection';
import SkillsSection from '@/components/about/SkillsSection';
import ContactSection from '@/components/about/ContactSection';

const About = () => {
  return (
    <div className="min-h-screen">
      <DynamicHeroSection />
      <SkillsSection />
      <ContactSection />
    </div>
  );
};

export default About;
