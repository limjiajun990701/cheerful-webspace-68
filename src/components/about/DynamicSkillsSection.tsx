
import React, { useState, useEffect } from 'react';
import SkillsCarouselSection from './SkillsCarouselSection';
import { getSkillGroups } from '@/utils/contentUtils';

interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

const DynamicSkillsSection = () => {
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      const data = await getSkillGroups();
      if (data && data.length > 0) {
        setSkillGroups(data);
      } else {
        setSkillGroups(defaultSkills);
      }
      setIsLoading(false);
    };

    fetchSkills();
  }, []);

  // Default skills as fallback
  const defaultSkills = [
    {
      id: "default-1",
      category: "Programming Languages",
      items: ["Dart", "JavaScript", "TypeScript", "PHP", "Java", "HTML", "CSS"],
    },
    {
      id: "default-2",
      category: "Frontend",
      items: ["Flutter", "Vue.js", "React"],
    },
    {
      id: "default-3",
      category: "Backend",
      items: ["PHP", "Java", "Quarkus"],
    },
    {
      id: "default-4",
      category: "Databases",
      items: ["MySQL", "SQLite", "MariaDB", "PostgreSQL"],
    },
    {
      id: "default-5",
      category: "Tools & Platforms",
      items: ["Git", "GitLab", "GitHub", "AWS", "Azure", "Oracle Cloud"],
    },
  ];

  if (isLoading) {
    return <div className="py-20 text-center">Loading skills...</div>;
  }

  // Map to the carousel section's API (omit id)
  const skillsForCarousel = (skillGroups.length > 0 ? skillGroups : defaultSkills).map((group) => ({
    category: group.category,
    items: group.items,
  }));

  return (
    <SkillsCarouselSection
      sectionTitle={
        <>
          <span className="text-primary drop-shadow font-sans">My</span>{" "}
          <span className="text-gray-100">Skills</span>
        </>
      }
      description="Technologies, languages, and tools I have experience with."
      skills={skillsForCarousel}
      joinButton={null}
      learnButton={null}
      carouselInterval={3400}
      skillsBgClassName="bg-gradient-to-br from-[#171A1F] via-[#21242B] to-[#2D293E]"
    />
  );
};

export default DynamicSkillsSection;
