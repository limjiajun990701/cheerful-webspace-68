
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Trash, Plus, Pencil, Save, X, Loader2, AlertTriangle } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  description: string | null;
}

interface SkillItem {
  id: string;
  skill_id: string;
  image_url: string;
  label: string;
  description: string | null;
  animation_type: string | null;
  display_order: number | null;
}

const MySkillManager = () => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [skillItems, setSkillItems] = useState<SkillItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSkill, setNewSkill] = useState({ name: "", description: "" });
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    image_url: "",
    label: "",
    description: "",
    animation_type: "scale",
    display_order: 0
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);

  // For now, we'll use mock data since the skills tables don't exist in the database
  // This prevents TypeScript errors while maintaining the UI functionality
  const mockSkills: Skill[] = [
    { id: "1", name: "Frontend Development", description: "Modern web technologies" },
    { id: "2", name: "Backend Development", description: "Server-side technologies" },
    { id: "3", name: "DevOps", description: "Deployment and infrastructure" }
  ];

  const mockSkillItems: SkillItem[] = [
    {
      id: "1",
      skill_id: "1",
      image_url: "https://via.placeholder.com/100",
      label: "React",
      description: "JavaScript library for building user interfaces",
      animation_type: "scale",
      display_order: 1
    },
    {
      id: "2",
      skill_id: "1",
      image_url: "https://via.placeholder.com/100",
      label: "TypeScript",
      description: "Typed superset of JavaScript",
      animation_type: "fade",
      display_order: 2
    }
  ];

  // Fetch all skills - using mock data for now
  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual Supabase call once tables are created
      // const { data, error } = await supabase.from('skills').select('*').order('name');
      // if (error) throw error;
      
      setSkills(mockSkills);
      if (mockSkills.length && !selectedSkill) {
        setSelectedSkill(mockSkills[0].id);
        fetchSkillItems(mockSkills[0].id);
      } else if (selectedSkill) {
        fetchSkillItems(selectedSkill);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch skills", variant: "destructive" });
      setIsLoading(false);
    }
  };

  // Fetch items for a specific skill - using mock data for now
  const fetchSkillItems = async (skillId: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual Supabase call once tables are created
      // const { data, error } = await supabase
      //   .from('skill_items')
      //   .select('*')
      //   .eq('skill_id', skillId)
      //   .order('display_order');
      // if (error) throw error;
      
      const filteredItems = mockSkillItems.filter(item => item.skill_id === skillId);
      setSkillItems(filteredItems);
      setIsLoading(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch skill items", variant: "destructive" });
      setIsLoading(false);
    }
  };

  // Load skills on mount
  useEffect(() => {
    fetchSkills();
  }, []);

  // Add new skill - mock implementation
  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
      toast({ title: "Error", description: "Skill name is required", variant: "destructive" });
      return;
    }
    try {
      // TODO: Replace with actual Supabase call once tables are created
      // const { error } = await supabase
      //   .from('skills')
      //   .insert([{
      //     name: newSkill.name,
      //     description: newSkill.description || null
      //   }]);
      // if (error) throw error;
      
      const newSkillObj: Skill = {
        id: Date.now().toString(),
        name: newSkill.name,
        description: newSkill.description || null
      };
      setSkills(prev => [...prev, newSkillObj]);
      
      toast({ title: "Success", description: "Skill created successfully (mock)" });
      setNewSkill({ name: "", description: "" });
      setIsAddingSkill(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to create skill", variant: "destructive" });
    }
  };

  // Delete a skill - mock implementation
  const handleDeleteSkill = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this skill and all its items?")) return;
    try {
      // TODO: Replace with actual Supabase call once tables are created
      // const { error } = await supabase.from('skills').delete().eq('id', id);
      // if (error) throw error;
      
      setSkills(prev => prev.filter(skill => skill.id !== id));
      if (selectedSkill === id) {
        setSelectedSkill(null);
        setSkillItems([]);
      }
      
      toast({ title: "Success", description: "Skill deleted successfully (mock)" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete skill", variant: "destructive" });
    }
  };

  // Add new item to a skill - mock implementation
  const handleAddItem = async () => {
    if (!selectedSkill) {
      toast({ title: "Error", description: "Please select a skill first", variant: "destructive" });
      return;
    }
    if (!newItem.image_url.trim() || !newItem.label.trim()) {
      toast({ title: "Error", description: "Image URL and label are required", variant: "destructive" });
      return;
    }
    try {
      // TODO: Replace with actual Supabase call once tables are created
      const newItemObj: SkillItem = {
        id: Date.now().toString(),
        skill_id: selectedSkill,
        image_url: newItem.image_url,
        label: newItem.label,
        description: newItem.description || null,
        animation_type: newItem.animation_type,
        display_order: skillItems.length + 1
      };
      
      setSkillItems(prev => [...prev, newItemObj]);
      toast({ title: "Success", description: "Item added successfully (mock)" });
      setNewItem({ image_url: "", label: "", description: "", animation_type: "scale", display_order: 0 });
      setIsAddingItem(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to add item", variant: "destructive" });
    }
  };

  // Update an item - mock implementation
  const handleUpdateItem = async (item: SkillItem) => {
    try {
      // TODO: Replace with actual Supabase call once tables are created
      setSkillItems(prev => prev.map(i => i.id === item.id ? item : i));
      toast({ title: "Success", description: "Item updated successfully (mock)" });
      setEditingItem(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update item", variant: "destructive" });
    }
  };

  // Delete an item - mock implementation
  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      // TODO: Replace with actual Supabase call once tables are created
      setSkillItems(prev => prev.filter(item => item.id !== id));
      toast({ title: "Success", description: "Item deleted successfully (mock)" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete item", variant: "destructive" });
    }
  };

  // Handle skill change
  const handleSkillChange = (skillId: string) => {
    setSelectedSkill(skillId);
    fetchSkillItems(skillId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Skill Manager</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Note: This is currently using mock data. Database tables need to be created.
          </p>
        </div>
        <Button onClick={() => setIsAddingSkill(!isAddingSkill)} variant="outline">
          {isAddingSkill ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {isAddingSkill ? "Cancel" : "New Skill"}
        </Button>
      </div>

      {isAddingSkill && (
        <Card>
          <CardHeader>
            <CardTitle>New Skill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input
                  value={newSkill.name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Skill name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description (optional)</label>
                <Textarea
                  value={newSkill.description}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Skill description"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddingSkill(false)}>Cancel</Button>
            <Button onClick={handleAddSkill}>Create Skill</Button>
          </CardFooter>
        </Card>
      )}

      {skills.length > 0 ? (
        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="items">Skill Items</TabsTrigger>
            <TabsTrigger value="skills">Manage Skills</TabsTrigger>
          </TabsList>
          
          <TabsContent value="items" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="w-1/3">
                <label className="text-sm font-medium mb-1 block">Select Skill</label>
                <Select
                  value={selectedSkill || ""}
                  onValueChange={handleSkillChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {skills.map(skill => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedSkill && (
                <Button onClick={() => setIsAddingItem(!isAddingItem)} variant="outline">
                  {isAddingItem ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {isAddingItem ? "Cancel" : "Add Item"}
                </Button>
              )}
            </div>

            {selectedSkill && isAddingItem && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Image URL</label>
                      <Input
                        value={newItem.image_url}
                        onChange={(e) => setNewItem(prev => ({ ...prev, image_url: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    {newItem.image_url && (
                      <div>
                        <label className="text-sm font-medium mb-1 block">Image Preview</label>
                        <img src={newItem.image_url} alt="preview" className="h-32 w-auto rounded border" />
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium mb-1 block">Label</label>
                      <Input
                        value={newItem.label}
                        onChange={(e) => setNewItem(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Item label"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Description (optional)</label>
                      <Textarea
                        value={newItem.description}
                        onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Item description"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Animation Type</label>
                      <Select
                        value={newItem.animation_type}
                        onValueChange={(value) => setNewItem(prev => ({ ...prev, animation_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select animation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scale">Scale</SelectItem>
                          <SelectItem value="move">Move</SelectItem>
                          <SelectItem value="fade">Fade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingItem(false)}>Cancel</Button>
                  <Button onClick={handleAddItem}>Add Item</Button>
                </CardFooter>
              </Card>
            )}

            {selectedSkill && (
              <div>
                {isLoading ? (
                  <div className="text-center py-8">Loading items...</div>
                ) : skillItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No items in this skill. Add some items to get started.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skillItems.map(item => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${item.image_url})` }} />
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-1">{item.label}</h3>
                          {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                          <p className="mt-2 text-xs text-muted-foreground">Animation: {item.animation_type || 'None'}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t pt-3">
                          <Button variant="outline" size="sm" onClick={() => setEditingItem(item.id)}>
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="skills" className="space-y-6">
            {skills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No skills yet. Create a skill to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map(skill => (
                  <Card key={skill.id}>
                    <CardHeader>
                      <CardTitle>{skill.name}</CardTitle>
                      {skill.description && (
                        <CardDescription>{skill.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleSkillChange(skill.id)}>
                        View Items
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteSkill(skill.id)}>
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : isLoading ? (
        <div className="text-center py-8">Loading skills...</div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No skills yet. Create a skill to get started.
        </div>
      )}
    </div>
  );
};

export default MySkillManager;
