
import React, { useState, useEffect } from "react";
import { getSkillGroups } from "@/utils/contentUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Image as ImageIcon } from "lucide-react";

interface SkillItem {
  name: string;
  iconUrl?: string;
}
interface SkillGroup {
  id: string;
  category: string;
  description?: string | null;
  items: SkillItem[];
}

const Skills = () => {
  const [groups, setGroups] = useState<SkillGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const res = await getSkillGroups();
      setGroups(res || []);
      if (res?.length) setSelectedGroup(res[0].id);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center">My Skill</h1>
        <div className="max-w-md mx-auto">
          <Skeleton className="h-10 w-full mb-8" />
          <Skeleton className="h-64 w-full rounded-lg mb-8" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center">My Skill</h1>
        <p className="text-center text-muted-foreground">No skill groups found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">My Skill</h1>
      <Tabs 
        value={selectedGroup || ""} 
        onValueChange={setSelectedGroup}
        className="max-w-5xl mx-auto"
      >
        <TabsList className="mb-8 w-full flex justify-center flex-wrap gap-2 bg-transparent">
          {groups.map(group => (
            <TabsTrigger 
              key={group.id} 
              value={group.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {group.category}
            </TabsTrigger>
          ))}
        </TabsList>

        {groups.map(group => (
          <TabsContent key={group.id} value={group.id}>
            {group.description && (
              <p className="text-center text-muted-foreground mb-8">
                {group.description}
              </p>
            )}
            {group.items?.length > 0 ? (
              <div className="w-full py-6 bg-secondary/10 overflow-x-auto rounded-xl">
                <div className="flex gap-4 px-4 min-w-max">
                  {group.items.map((item, idx) => (
                    <Card
                      key={`${group.id}-${idx}`}
                      className="flex flex-col items-center w-[160px] min-w-[140px] px-4 py-4 border-none bg-background shadow hover:scale-105 transition-transform"
                    >
                      <div className="w-16 h-16 mb-2 flex items-center justify-center bg-muted rounded">
                        {item.iconUrl ? (
                          <ImageWithFallback
                            src={item.iconUrl}
                            alt={item.name}
                            className="w-10 h-10 object-contain rounded"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="font-medium">{item.name}</div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground mt-4">
                No skills in this category yet.
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Skills;
