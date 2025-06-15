
import { useEffect, useState } from "react";
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

  // Mock data for now since database tables don't exist yet
  const mockSkills: Skill[] = [
    { id: "1", name: "Frontend Development", description: "Modern web technologies and frameworks" },
    { id: "2", name: "Backend Development", description: "Server-side technologies and APIs" },
    { id: "3", name: "DevOps", description: "Deployment and infrastructure management" }
  ];

  const mockItems: SkillItem[] = [
    {
      id: "1",
      skill_id: "1",
      label: "React",
      description: "JavaScript library for building user interfaces",
      image_url: "https://via.placeholder.com/100/61DAFB/000000?text=React"
    },
    {
      id: "2",
      skill_id: "1",
      label: "TypeScript",
      description: "Typed superset of JavaScript",
      image_url: "https://via.placeholder.com/100/3178C6/FFFFFF?text=TS"
    },
    {
      id: "3",
      skill_id: "2",
      label: "Node.js",
      description: "JavaScript runtime for server-side development",
      image_url: "https://via.placeholder.com/100/339933/FFFFFF?text=Node"
    },
    {
      id: "4",
      skill_id: "3",
      label: "Docker",
      description: "Containerization platform",
      image_url: "https://via.placeholder.com/100/2496ED/FFFFFF?text=Docker"
    }
  ];

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      // TODO: Replace with actual Supabase calls once tables are created
      // const { data: skillsData } = await supabase.from("skills").select("*").order("name");
      // setSkills(skillsData || []);
      // const { data: itemsData } = await supabase.from("skill_items").select("*");
      // setItems(itemsData || []);
      
      // Using mock data for now
      setSkills(mockSkills);
      setItems(mockItems);
      setLoading(false);
    };
    fetchSkills();
  }, []);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Skills</h1>
        <p className="text-muted-foreground">
          Note: This page is currently using mock data. Database integration pending.
        </p>
      </div>
      
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
