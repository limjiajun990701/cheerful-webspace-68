
import React from "react";
import DynamicSkillsSection from "@/components/about/DynamicSkillsSection";

const MySkill = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="w-full text-center pt-20 pb-6 bg-gradient-to-br from-[#13161C] via-[#191B23] to-[#27243a]">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-[#2FFF6F] drop-shadow-lg">My Skill</h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          We are still learning more knowledge, welcome to join us and make progress together with us
        </p>
      </header>
      <DynamicSkillsSection />
    </div>
  );
};

export default MySkill;
