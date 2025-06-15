
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Skill, SkillItem } from "@/types/database";

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [items, setItems] = useState<SkillItem[]>([]);
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
        
        const { data: itemsData, error: itemsError } = await supabase
          .from("skill_items" as any)
          .select("*")
          .order("display_order");
        
        if (itemsError) throw itemsError;
        
        setSkills((skillsData as unknown as Skill[]) || []);
        setItems((itemsData as unknown as SkillItem[]) || []);
      } catch (error) {
        console.error('Error fetching skills:', error);
        // If there's an error (like tables don't exist), fall back to empty arrays
        setSkills([]);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSkills();
  }, []);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Skills</h1>
        <p className="text-muted-foreground">
          Explore my technical skills and expertise across various technologies.
        </p>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading skills...</div>
      ) : skills.length === 0 ? (
        <div className="text-muted-foreground text-center py-8">
          No skills available yet. Check back later!
        </div>
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
                    <div className="text-xs text-muted-foreground">No items yet.</div>
                  ) : (
                    items.filter(item => item.skill_id === skill.id).map((item) => (
                      <div key={item.id} className="flex flex-col items-center w-32">
                        <img src={item.image_url} alt={item.label} className="h-16 w-16 rounded border mb-2 object-cover" />
                        <div className="font-medium text-sm text-center">{item.label}</div>
                        {item.description && <div className="text-xs text-muted-foreground text-center mt-1">{item.description}</div>}
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
