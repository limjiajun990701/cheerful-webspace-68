
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skill } from "@/types/database";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import SkillCarousel from "@/components/skills/SkillCarousel";

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const { data: skillsData, error: skillsError } = await supabase
          .from("skills" as any)
          .select("*")
          .order("name");

        if (skillsError) throw skillsError;

        const skills = (skillsData as unknown as Skill[]) || [];
        setSkills(skills);

        if (skills.length > 0) {
          setSelectedSkill(skills[0].id);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center">My Skills</h1>
        <div className="max-w-md mx-auto">
          <Skeleton className="h-10 w-full mb-8" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center">My Skills</h1>
        <p className="text-center text-muted-foreground">No skills available yet. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">My Skills</h1>
        <p className="text-muted-foreground">
          Explore my technical skills and expertise across various technologies.
        </p>
      </div>

      <Tabs
        value={selectedSkill || ""}
        onValueChange={setSelectedSkill}
        className="max-w-5xl mx-auto"
      >
        <TabsList className="mb-8 w-full flex justify-center flex-wrap gap-2 bg-transparent">
          {skills.map((skill) => (
            <TabsTrigger
              key={skill.id}
              value={skill.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {skill.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {skills.map((skill) => (
          <TabsContent key={skill.id} value={skill.id}>
            {skill.description && (
              <p className="text-center text-muted-foreground mb-8">{skill.description}</p>
            )}
            <SkillCarousel skillId={skill.id} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Skills;
