
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import {
  getSkillGroups,
  createSkillGroup,
  updateSkillGroup,
  deleteSkillGroup,
  uploadSiteImage,
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
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Code, Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon, Briefcase } from "lucide-react";

interface SkillItem {
  name: string;
  iconUrl?: string;
}
interface SkillGroup {
  id: string;
  category: string;
  items: SkillItem[];
}

const SkillsManager = () => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editSkill, setEditSkill] = useState<SkillGroup | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newSkillItem, setNewSkillItem] = useState<{ name: string, iconUrl?: string }>({ name: '', iconUrl: '' });
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    setEditSkill({
      ...skill,
      items: skill.items.map((item: any) =>
        typeof item === 'string' ? { name: item, iconUrl: "" } : { ...item }
      ),
    });
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
      editSkill.items
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
    if (editSkill && newSkillItem.name.trim()) {
      setEditSkill({
        ...editSkill,
        items: [
          ...editSkill.items,
          {
            name: newSkillItem.name.trim(),
            iconUrl: newSkillItem.iconUrl ? newSkillItem.iconUrl : "",
          },
        ],
      });
      setNewSkillItem({ name: '', iconUrl: '' });
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

  // Upload handler for icon
  const handleSkillIconUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    cb: (url: string) => void
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const uploadPath = `skills-icons/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const uploadResult = await uploadSiteImage(file, uploadPath);
      if (uploadResult?.publicUrl || uploadResult?.url) {
        cb(uploadResult.publicUrl || uploadResult.url);
        toast({
          title: "Icon Uploaded",
          description: "Icon uploaded successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to upload icon.",
          variant: "destructive",
        });
      }
    }
  };

  const openUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
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
          <DialogContent className="sm:max-w-[545px]">
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
                      ? setEditSkill({ ...editSkill, category: e.target.value })
                      : setNewCategory(e.target.value)
                  }
                  placeholder="e.g., Programming Languages"
                />
              </div>
              {editSkill && (
                <div className="space-y-4">
                  <label className="text-sm font-medium">Skills</label>
                  {/* SKILL ICON TABLE */}
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[100px]">
                    {editSkill.items.map((item, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-2 py-1 flex items-center gap-2"
                      >
                        {item.iconUrl ? (
                          <ImageWithFallback
                            src={item.iconUrl}
                            alt={item.name}
                            className="w-5 h-5 rounded object-cover border bg-muted"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-muted" />
                        )}
                        {item.name}
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
                  <div className="flex flex-col md:flex-row gap-2 items-center">
                    <Input
                      value={newSkillItem.name}
                      onChange={(e) =>
                        setNewSkillItem((curr) => ({
                          ...curr,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Skill name"
                      className="w-full md:w-auto"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkillItem();
                        }
                      }}
                    />
                    <Input
                      value={newSkillItem.iconUrl || ""}
                      onChange={(e) =>
                        setNewSkillItem((curr) => ({
                          ...curr,
                          iconUrl: e.target.value,
                        }))
                      }
                      placeholder="Image URL (optional)"
                      className="w-full md:w-[220px]"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleSkillIconUpload(e, (url: string) =>
                          setNewSkillItem((curr) => ({
                            ...curr,
                            iconUrl: url,
                          }))
                        )
                      }
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="flex gap-2"
                      onClick={openUpload}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Icon
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={addSkillItem}
                      className="md:ml-2"
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
                  setNewSkillItem({ name: '', iconUrl: '' });
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
                    <TableCell className="font-medium">
                      {skill.category}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {skill.items.slice(0, 5).map((item, i) => (
                          <Badge key={i} variant="secondary" className="bg-secondary/50 flex gap-1 items-center">
                            {item.iconUrl ? (
                              <ImageWithFallback
                                src={item.iconUrl}
                                alt={item.name}
                                className="w-4 h-4 rounded object-cover border bg-muted"
                              />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-muted" />
                            )}
                            {item.name}
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
