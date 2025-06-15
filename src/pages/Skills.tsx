
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Skill {
  id: string;
  name: string;
  description: string | null;
}

interface SkillItem {
  id: string;
  skill_id: string;
  label: string;
  description: string | null;
  image_url: string;
}

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [items, setItems] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      const { data: skillsData } = await supabase.from("skills").select("*").order("name");
      setSkills(skillsData || []);
      const { data: itemsData } = await supabase.from("skill_items").select("*");
      setItems(itemsData || []);
      setLoading(false);
    };
    fetchSkills();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Skills</h1>
      {loading ? (
        <div className="text-center py-8">Loading skills...</div>
      ) : skills.length === 0 ? (
        <div className="text-muted-foreground text-center py-8">No skills available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Card key={skill.id}>
              <CardHeader>
                <CardTitle>{skill.name}</CardTitle>
                {skill.description && (
                  <CardDescription>{skill.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {items.filter(item => item.skill_id === skill.id).length === 0 ? (
                    <div className="text-xs text-muted-foreground">No items.</div>
                  ) : (
                    items.filter(item => item.skill_id === skill.id).map((item) => (
                      <div key={item.id} className="flex flex-col items-center w-32">
                        <img src={item.image_url} alt={item.label} className="h-16 w-16 rounded border mb-2 object-cover" />
                        <div className="font-medium">{item.label}</div>
                        {item.description && <div className="text-xs text-muted-foreground text-center">{item.description}</div>}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Skills;
