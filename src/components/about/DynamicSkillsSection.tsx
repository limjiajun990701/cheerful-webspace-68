
import React, { useState, useEffect } from 'react';
import SkillsCarouselSection from './SkillsCarouselSection';
import { getSkillGroups } from '@/utils/contentUtils';

const iconMap: Record<string, string> = {
  "Dart": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
  "JavaScript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  "TypeScript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "PHP": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  "Java": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  "HTML": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  "Flutter": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
  "Vue.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  "React": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "Quarkus": "",
  "MySQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  "SQLite": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
  "MariaDB": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mariadb/mariadb-original.svg",
  "PostgreSQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  "Git": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  "GitLab": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg",
  "GitHub": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  "AWS": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
  "Azure": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
  "Oracle Cloud": "",
};

interface SkillGroup {
  id: string;
  category: string;
  items: {
    name: string;
    iconUrl?: string;
  }[];
}

const DynamicSkillsSection = () => {
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      const data = await getSkillGroups();
      if (data && data.length > 0) {
        setSkillGroups(
          data.map((group: any) => ({
            ...group,
            items: group.items.map((item: any) =>
              typeof item === 'string'
                ? { name: item, iconUrl: iconMap[item] || "" }
                : { ...item, iconUrl: item.iconUrl || iconMap[item.name] || "" }
            ),
          }))
        );
      } else {
        setSkillGroups(defaultSkills);
      }
      setIsLoading(false);
    };

    fetchSkills();
  }, []);

  // Default skills as fallback
  const defaultSkills: SkillGroup[] = [
    {
      id: "default-1",
      category: "Programming Languages",
      items: [
        { name: "Dart", iconUrl: iconMap["Dart"] },
        { name: "JavaScript", iconUrl: iconMap["JavaScript"] },
        { name: "TypeScript", iconUrl: iconMap["TypeScript"] },
        { name: "PHP", iconUrl: iconMap["PHP"] },
        { name: "Java", iconUrl: iconMap["Java"] },
        { name: "HTML", iconUrl: iconMap["HTML"] },
        { name: "CSS", iconUrl: iconMap["CSS"] },
      ],
    },
    {
      id: "default-2",
      category: "Frontend",
      items: [
        { name: "Flutter", iconUrl: iconMap["Flutter"] },
        { name: "Vue.js", iconUrl: iconMap["Vue.js"] },
        { name: "React", iconUrl: iconMap["React"] },
      ],
    },
    {
      id: "default-3",
      category: "Backend",
      items: [
        { name: "PHP", iconUrl: iconMap["PHP"] },
        { name: "Java", iconUrl: iconMap["Java"] },
        { name: "Quarkus", iconUrl: "" },
      ],
    },
    {
      id: "default-4",
      category: "Databases",
      items: [
        { name: "MySQL", iconUrl: iconMap["MySQL"] },
        { name: "SQLite", iconUrl: iconMap["SQLite"] },
        { name: "MariaDB", iconUrl: iconMap["MariaDB"] },
        { name: "PostgreSQL", iconUrl: iconMap["PostgreSQL"] },
      ],
    },
    {
      id: "default-5",
      category: "Tools & Platforms",
      items: [
        { name: "Git", iconUrl: iconMap["Git"] },
        { name: "GitLab", iconUrl: iconMap["GitLab"] },
        { name: "GitHub", iconUrl: iconMap["GitHub"] },
        { name: "AWS", iconUrl: iconMap["AWS"] },
        { name: "Azure", iconUrl: iconMap["Azure"] },
        { name: "Oracle Cloud", iconUrl: "" },
      ],
    },
  ];

  if (isLoading) {
    return <div className="py-20 text-center">Loading skills...</div>;
  }

  return (
    <SkillsCarouselSection
      sectionTitle={
        <>
          <span className="text-[#2FFF6F] drop-shadow font-sans">Technologies</span>{" "}
          <span className="text-gray-100">We Use</span>
        </>
      }
      description="We are still learning more knowledge, welcome to join us and make progress together with us"
      skills={skillGroups.length > 0 ? skillGroups : defaultSkills}
      joinButton={null}
      learnButton={null}
      carouselInterval={3400}
      skillsBgClassName="bg-gradient-to-br from-[#13161C] via-[#191B23] to-[#27243a]"
    />
  );
};

export default DynamicSkillsSection;
