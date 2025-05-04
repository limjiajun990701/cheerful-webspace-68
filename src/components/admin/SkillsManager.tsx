
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  getSkillGroups, 
  createSkillGroup, 
  updateSkillGroup, 
  deleteSkillGroup 
} from "@/utils/contentUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Code, Plus, Edit, Trash2, Save, X, Briefcase } from "lucide-react";

interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

const SkillsManager = () => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editSkill, setEditSkill] = useState<SkillGroup | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newSkillItem, setNewSkillItem] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setIsLoading(true);
    const data = await getSkillGroups();
    setSkills(data);
    setIsLoading(false);
  };

  const handleSaveNewSkill = async () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    const result = await createSkillGroup(newCategory.trim());
    if (result.success) {
      toast({
        title: "Success",
        description: "Skill category created successfully",
      });
      setNewCategory('');
      fetchSkills();
      setIsOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to create skill category",
        variant: "destructive",
      });
    }
  };

  const handleEditSkill = (skill: SkillGroup) => {
    setEditSkill({...skill});
    setIsOpen(true);
  };

  const handleUpdateSkill = async () => {
    if (!editSkill) return;
    
    if (!editSkill.category.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    const result = await updateSkillGroup(
      editSkill.id, 
      editSkill.category.trim(), 
      editSkill.items.filter(item => item.trim() !== '')
    );

    if (result.success) {
      toast({
        title: "Success",
        description: "Skill category updated successfully",
      });
      fetchSkills();
      setIsOpen(false);
      setEditSkill(null);
    } else {
      toast({
        title: "Error",
        description: "Failed to update skill category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (confirm("Are you sure you want to delete this skill category?")) {
      const result = await deleteSkillGroup(id);
      if (result.success) {
        toast({
          title: "Success",
          description: "Skill category deleted successfully",
        });
        fetchSkills();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete skill category",
          variant: "destructive",
        });
      }
    }
  };

  const addSkillItem = () => {
    if (editSkill && newSkillItem.trim()) {
      setEditSkill({
        ...editSkill,
        items: [...editSkill.items, newSkillItem.trim()]
      });
      setNewSkillItem('');
    }
  };

  const removeSkillItem = (index: number) => {
    if (editSkill) {
      const newItems = [...editSkill.items];
      newItems.splice(index, 1);
      setEditSkill({
        ...editSkill,
        items: newItems
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Skills</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Skill Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {editSkill ? 'Edit Skill Category' : 'Add New Skill Category'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category Name
                </label>
                <Input
                  id="category"
                  value={editSkill ? editSkill.category : newCategory}
                  onChange={(e) => 
                    editSkill 
                      ? setEditSkill({...editSkill, category: e.target.value})
                      : setNewCategory(e.target.value)
                  }
                  placeholder="e.g., Programming Languages"
                />
              </div>
              
              {editSkill && (
                <div className="space-y-4">
                  <label className="text-sm font-medium">Skills</label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[100px]">
                    {editSkill.items.map((item, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="px-2 py-1 flex items-center gap-1"
                      >
                        {item}
                        <button 
                          type="button" 
                          className="ml-1 hover:bg-destructive/10 rounded-full p-0.5"
                          onClick={() => removeSkillItem(index)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input 
                      value={newSkillItem}
                      onChange={(e) => setNewSkillItem(e.target.value)}
                      placeholder="Add new skill"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkillItem();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={addSkillItem}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsOpen(false);
                  setEditSkill(null);
                  setNewCategory('');
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={editSkill ? handleUpdateSkill : handleSaveNewSkill}
              >
                {editSkill ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skill Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : skills.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">{skill.category}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {skill.items.slice(0, 5).map((item, i) => (
                          <Badge key={i} variant="secondary" className="bg-secondary/50">
                            {item}
                          </Badge>
                        ))}
                        {skill.items.length > 5 && (
                          <Badge variant="outline">+{skill.items.length - 5} more</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditSkill(skill)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteSkill(skill.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No skill categories found. Add your first category to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsManager;
