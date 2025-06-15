
import React from 'react';
import DynamicHeroSection from '@/components/about/DynamicHeroSection';
import ContactSection from '@/components/about/ContactSection';

const About = () => {
  return (
    <div className="min-h-screen">
      <DynamicHeroSection />
      <ContactSection />
    </div>
  );
};

export default About;
