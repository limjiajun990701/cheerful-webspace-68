
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Plus, Trash, Edit, Save, X, Upload, Image as ImageIcon } from "lucide-react";
import {
  getSkillGroups,
  createSkillGroup,
  updateSkillGroup,
  deleteSkillGroup,
  uploadSiteImage
} from "@/utils/contentUtils";

interface SkillItem {
  name: string;
  iconUrl?: string;
}
interface SkillGroup {
  id: string;
  category: string;
  items: SkillItem[];
}

const SkillCategoryManager = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<SkillGroup[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ category: "" });
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState<{ name: string; iconUrl?: string }>({ name: "", iconUrl: "" });
  const [editingSkillIdx, setEditingSkillIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [iconUploadTarget, setIconUploadTarget] = useState<"new" | number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    const groups = await getSkillGroups();
    setCategories(groups || []);
    if (groups?.length && !selectedCategory) {
      setSelectedCategory(groups[0].id);
    }
    setIsLoading(false);
  };

  const handleAddCategory = async () => {
    if (!newCategory.category.trim()) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive",
      });
      return;
    }
    const res = await createSkillGroup(newCategory.category.trim());
    if (res.success) {
      toast({ title: "Success", description: "Category created." });
      setNewCategory({ category: "" });
      setIsAddingCategory(false);
      fetchCategories();
    } else {
      toast({ title: "Error", description: "Could not create category.", variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Delete this skill category and all its skills?")) return;
    const res = await deleteSkillGroup(id);
    if (res.success) {
      toast({ title: "Success", description: "Category deleted." });
      if (selectedCategory === id) setSelectedCategory(null);
      fetchCategories();
    } else {
      toast({ title: "Error", description: "Could not delete category.", variant: "destructive" });
    }
  };

  // For editing a skill within a category
  const setSkillValue = (idx: number, skill: SkillItem) => {
    setCategories(cats => cats.map(cat =>
      cat.id === selectedCategory
        ? { ...cat, items: cat.items.map((it, i) => (i === idx ? skill : it)) }
        : cat
    ));
  };

  const handleAddSkill = async () => {
    if (!selectedCategory) return;
    if (!newSkill.name.trim()) {
      toast({
        title: "Error",
        description: "Skill name is required.",
        variant: "destructive",
      });
      return;
    }
    const cat = categories.find(c => c.id === selectedCategory);
    if (!cat) return;
    const updated = [...cat.items, { name: newSkill.name.trim(), iconUrl: newSkill.iconUrl }];
    const res = await updateSkillGroup(cat.id, cat.category, updated);
    if (res.success) {
      toast({ title: "Success", description: "Skill added." });
      setNewSkill({ name: "", iconUrl: "" });
      fetchCategories();
    } else {
      toast({ title: "Error", description: "Could not add skill.", variant: "destructive" });
    }
  };

  const handleDeleteSkill = async (idx: number) => {
    if (!selectedCategory) return;
    const cat = categories.find(c => c.id === selectedCategory);
    if (!cat) return;
    if (!window.confirm("Delete this skill?")) return;
    const updated = cat.items.filter((_, i) => i !== idx);
    const res = await updateSkillGroup(cat.id, cat.category, updated);
    if (res.success) {
      toast({ title: "Success", description: "Skill deleted." });
      fetchCategories();
    } else {
      toast({ title: "Error", description: "Could not delete skill.", variant: "destructive" });
    }
  };

  const handleEditSkill = (idx: number) => {
    setEditingSkillIdx(idx);
    setNewSkill({ ...categories.find(c => c.id === selectedCategory)!.items[idx] });
  };

  const handleSaveSkillEdit = async () => {
    if (!selectedCategory || editingSkillIdx === null) return;
    const cat = categories.find(c => c.id === selectedCategory);
    if (!cat) return;
    if (!newSkill.name.trim()) {
      toast({
        title: "Error",
        description: "Skill name is required.",
        variant: "destructive",
      });
      return;
    }
    const updated = cat.items.map((it, i) => i === editingSkillIdx ? { name: newSkill.name.trim(), iconUrl: newSkill.iconUrl } : it);
    const res = await updateSkillGroup(cat.id, cat.category, updated);
    if (res.success) {
      toast({ title: "Success", description: "Skill updated." });
      setEditingSkillIdx(null);
      setNewSkill({ name: "", iconUrl: "" });
      fetchCategories();
    } else {
      toast({ title: "Error", description: "Could not update skill.", variant: "destructive" });
    }
  };

  // Image upload flow
  const openFileInput = (target: "new" | number) => {
    setIconUploadTarget(target);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && iconUploadTarget !== null) {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const uploadPath = `skills-icons/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const uploadResult = await uploadSiteImage(file, uploadPath);
      const url = uploadResult?.publicUrl || uploadResult?.url;
      if (!url) {
        toast({ title: "Error", description: "Failed to upload icon.", variant: "destructive" });
        return;
      }
      toast({ title: "Icon Uploaded", description: "Icon uploaded successfully." });
      if (iconUploadTarget === "new") {
        setNewSkill(skill => ({ ...skill, iconUrl: url }));
      } else if (typeof iconUploadTarget === "number" && selectedCategory) {
        const cat = categories.find(c => c.id === selectedCategory);
        if (!cat) return;
        const updated = cat.items.map((item, i) => i === iconUploadTarget ? { ...item, iconUrl: url } : item);
        updateSkillGroup(cat.id, cat.category, updated);
        fetchCategories();
      }
      setIconUploadTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="items">Skills</TabsTrigger>
          <TabsTrigger value="categories">Manage Categories</TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="items" className="space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <div className="w-full md:w-1/3">
              <label className="text-sm font-medium mb-1 block">Select Category</label>
              <Select value={selectedCategory || ""} onValueChange={v => setSelectedCategory(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCategory && (
              <Button onClick={() => setIsAddingSkill(!isAddingSkill)} variant="outline">
                {isAddingSkill ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {isAddingSkill ? "Cancel" : "Add Skill"}
              </Button>
            )}
          </div>
          {selectedCategory && isAddingSkill && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Skill</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-3 items-center">
                  <Input
                    value={newSkill.name}
                    onChange={e => setNewSkill(sk => ({ ...sk, name: e.target.value }))}
                    placeholder="Skill name"
                  />
                  <Input
                    value={newSkill.iconUrl || ""}
                    onChange={e => setNewSkill(sk => ({ ...sk, iconUrl: e.target.value }))}
                    placeholder="Image URL (optional)"
                    className="w-full md:w-[220px]"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleIconUpload}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => openFileInput("new")}
                  >
                    <Upload className="w-4 h-4" /> Upload Icon
                  </Button>
                  <Button type="button" onClick={handleAddSkill} className="md:ml-2">
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          <div>
            {selectedCategory && (
              <>
                {isLoading ? (
                  <div className="py-8 text-center">Loading...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.find(c => c.id === selectedCategory)?.items.map((item, idx) =>
                      editingSkillIdx === idx ? (
                        <Card key={idx} className="space-y-2">
                          <CardHeader>
                            <CardTitle>Edit Skill</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-col md:flex-row gap-3 items-center">
                              <Input
                                value={newSkill.name}
                                onChange={e => setNewSkill(sk => ({ ...sk, name: e.target.value }))}
                                placeholder="Skill name"
                              />
                              <Input
                                value={newSkill.iconUrl || ""}
                                onChange={e => setNewSkill(sk => ({ ...sk, iconUrl: e.target.value }))}
                                placeholder="Image URL"
                                className="w-full md:w-[220px]"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleIconUpload}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => openFileInput(idx)}
                              >
                                <Upload className="w-4 h-4" /> Upload Icon
                              </Button>
                              <Button type="button" onClick={handleSaveSkillEdit}>
                                <Save className="h-4 w-4 mr-1" /> Save
                              </Button>
                              <Button variant="outline" onClick={() => setEditingSkillIdx(null)}>
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card key={idx} className="flex items-center gap-4 p-3">
                          <div className="w-12 h-12 rounded bg-muted border flex items-center justify-center mr-2">
                            {item.iconUrl ? (
                              <ImageWithFallback src={item.iconUrl} alt={item.name} className="w-8 h-8 object-cover rounded" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-muted" />
                            )}
                          </div>
                          <span className="font-medium">{item.name}</span>
                          <div className="ml-auto flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditSkill(idx)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteSkill(idx)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      )
                    )}
                    {/* If no skills yet */}
                    {categories.find(c => c.id === selectedCategory)?.items.length === 0 && (
                      <div className="text-center col-span-full text-sm text-muted-foreground mt-4">
                        No skills in this category yet.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>

        {/* Categories tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex flex-row justify-end">
            <Button onClick={() => setIsAddingCategory(!isAddingCategory)} variant="outline">
              {isAddingCategory ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {isAddingCategory ? "Cancel" : "Add Category"}
            </Button>
          </div>
          {isAddingCategory && (
            <Card>
              <CardHeader>
                <CardTitle>Add Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={newCategory.category}
                  onChange={e => setNewCategory({ category: e.target.value })}
                  placeholder="e.g., Frontend"
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingCategory(false)}>Cancel</Button>
                <Button onClick={handleAddCategory}>Add</Button>
              </CardFooter>
            </Card>
          )}

          {isLoading ? (
            <div className="py-6 text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => (
                <Card key={cat.id} className="flex items-center px-3 py-2 gap-2">
                  <div className="font-medium flex-1">{cat.category}</div>
                  <Badge className="ml-auto">{cat.items.length} skills</Badge>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteCategory(cat.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
              {categories.length === 0 && (
                <div className="col-span-full text-center text-sm text-muted-foreground">
                  No categories found. Add a category to begin.
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SkillCategoryManager;

