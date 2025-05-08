
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  getExpertiseContent, 
  updateExpertiseContent 
} from "@/utils/contentUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Loader2, Save, Plus, Edit, Trash2, MoreVertical, Check } from "lucide-react";

interface ExpertiseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ExpertiseContent {
  id: string;
  title: string;
  subtitle: string;
  skills: string[];
  items: ExpertiseItem[];
}

const iconOptions = [
  'smartphone', 'code', 'layout', 'database', 'server', 'globe', 
  'cloud', 'monitor', 'cpu', 'settings', 'wifi', 'award'
];

const defaultSkillColors = [
  'blue', 'green', 'orange', 'indigo', 'purple', 'yellow', 'cyan'
];

const ExpertiseManager = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState<ExpertiseContent | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<ExpertiseItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadExpertiseContent();
  }, []);

  const loadExpertiseContent = async () => {
    setIsLoading(true);
    try {
      const data = await getExpertiseContent();
      
      if (data) {
        // Parse description field as JSON
        let parsedItems: ExpertiseItem[] = [];
        let parsedSkills: string[] = [];
        
        try {
          const descData = JSON.parse(data.description || '{}');
          parsedItems = descData.items || [];
          parsedSkills = descData.skills || [];
        } catch (e) {
          console.error('Error parsing description JSON:', e);
        }
        
        setContent({
          id: data.id,
          title: data.title || 'My Expertise',
          subtitle: data.subtitle || 'I specialize in full-stack development with experience in both mobile and web technologies.',
          skills: parsedSkills.length ? parsedSkills : ['Flutter', 'Vue.js', 'Java', 'TypeScript', 'PHP', 'AWS', 'Azure', 'MySQL'],
          items: parsedItems.length ? parsedItems : [
            {
              id: '1',
              title: 'Mobile Development',
              description: 'Building responsive and feature-rich mobile applications using Flutter and native technologies.',
              icon: 'smartphone'
            },
            {
              id: '2',
              title: 'Frontend Development',
              description: 'Creating responsive and intuitive user interfaces with Vue.js, TypeScript, and modern web technologies.',
              icon: 'layout'
            },
            {
              id: '3',
              title: 'Backend Development',
              description: 'Building robust server-side applications and APIs using Java, PHP, and database technologies.',
              icon: 'server'
            }
          ]
        });
      } else {
        // Set default values if no data exists
        setContent({
          id: '',
          title: 'My Expertise',
          subtitle: 'I specialize in full-stack development with experience in both mobile and web technologies.',
          skills: ['Flutter', 'Vue.js', 'Java', 'TypeScript', 'PHP', 'AWS', 'Azure', 'MySQL'],
          items: [
            {
              id: '1',
              title: 'Mobile Development',
              description: 'Building responsive and feature-rich mobile applications using Flutter and native technologies.',
              icon: 'smartphone'
            },
            {
              id: '2',
              title: 'Frontend Development',
              description: 'Creating responsive and intuitive user interfaces with Vue.js, TypeScript, and modern web technologies.',
              icon: 'layout'
            },
            {
              id: '3',
              title: 'Backend Development',
              description: 'Building robust server-side applications and APIs using Java, PHP, and database technologies.',
              icon: 'server'
            }
          ]
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load expertise content',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContent = async () => {
    if (!content) return;
    
    setIsSaving(true);
    try {
      // Convert the expertise items to JSON string
      const descriptionData = {
        items: content.items,
        skills: content.skills
      };
      
      const result = await updateExpertiseContent(
        content.id || null, 
        {
          title: content.title,
          subtitle: content.subtitle,
          description: JSON.stringify(descriptionData)
        }
      );
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Expertise content updated successfully',
        });
        
        if (!content.id && result.data) {
          setContent({
            ...content,
            id: result.data.id
          });
        }
      } else {
        throw new Error('Failed to update expertise content');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save expertise content',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (!content || !newSkill.trim()) return;
    
    if (content.skills.includes(newSkill.trim())) {
      toast({
        title: 'Error',
        description: 'This skill already exists',
        variant: 'destructive'
      });
      return;
    }
    
    setContent({
      ...content,
      skills: [...content.skills, newSkill.trim()]
    });
    setNewSkill('');
  };

  const removeSkill = (index: number) => {
    if (!content) return;
    
    const newSkills = [...content.skills];
    newSkills.splice(index, 1);
    
    setContent({
      ...content,
      skills: newSkills
    });
  };

  const addExpertiseItem = () => {
    if (!content) return;
    
    const newItem: ExpertiseItem = {
      id: Date.now().toString(),
      title: 'New Expertise',
      description: 'Description goes here',
      icon: 'code'
    };
    
    setContent({
      ...content,
      items: [...content.items, newItem]
    });
    
    setEditingItemIndex(content.items.length);
    setEditItem(newItem);
    setDialogOpen(true);
  };

  const editExpertiseItem = (index: number) => {
    if (!content) return;
    
    setEditingItemIndex(index);
    setEditItem({...content.items[index]});
    setDialogOpen(true);
  };

  const saveExpertiseItem = () => {
    if (!content || editingItemIndex === null || !editItem) return;
    
    const newItems = [...content.items];
    newItems[editingItemIndex] = editItem;
    
    setContent({
      ...content,
      items: newItems
    });
    
    setDialogOpen(false);
    setEditingItemIndex(null);
    setEditItem(null);
  };

  const deleteExpertiseItem = (index: number) => {
    if (!content) return;
    
    if (content.items.length <= 1) {
      toast({
        title: 'Error',
        description: 'You need at least one expertise item',
        variant: 'destructive'
      });
      return;
    }
    
    const newItems = [...content.items];
    newItems.splice(index, 1);
    
    setContent({
      ...content,
      items: newItems
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-8">
        <p>No content available. Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Expertise Section Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                value={content.title}
                onChange={(e) => setContent({...content, title: e.target.value})}
                placeholder="My Expertise"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Section Subtitle</Label>
              <Textarea
                id="subtitle"
                value={content.subtitle}
                onChange={(e) => setContent({...content, subtitle: e.target.value})}
                placeholder="I specialize in..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {content.skills.map((skill, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium bg-${defaultSkillColors[index % defaultSkillColors.length]}-100 text-${defaultSkillColors[index % defaultSkillColors.length]}-800 flex items-center gap-2`}
                >
                  {skill}
                  <button
                    type="button"
                    className="hover:bg-gray-200 rounded-full p-1"
                    onClick={() => removeSkill(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter new skill"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button onClick={addSkill} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Expertise Items</CardTitle>
          <Button variant="outline" size="sm" onClick={addExpertiseItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Icon</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {content.items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{item.description}</TableCell>
                  <TableCell>{item.icon}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => editExpertiseItem(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteExpertiseItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSaveContent} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save All Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItemIndex !== null && editItem ? 'Edit Expertise Item' : 'Add Expertise Item'}
            </DialogTitle>
          </DialogHeader>
          
          {editItem && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="item-title">Title</Label>
                <Input
                  id="item-title"
                  value={editItem.title}
                  onChange={(e) => setEditItem({...editItem, title: e.target.value})}
                  placeholder="Enter title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-description">Description</Label>
                <Textarea
                  id="item-description"
                  value={editItem.description}
                  onChange={(e) => setEditItem({...editItem, description: e.target.value})}
                  placeholder="Enter description"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`p-2 rounded-md flex items-center justify-center ${
                        editItem.icon === icon 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                      onClick={() => setEditItem({...editItem, icon: icon})}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDialogOpen(false);
                setEditingItemIndex(null);
                setEditItem(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={saveExpertiseItem}>
              <Check className="h-4 w-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpertiseManager;
