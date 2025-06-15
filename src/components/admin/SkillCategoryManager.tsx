
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  description?: string;
  iconUrl?: string;
  animationType?: string;
  removeBg?: boolean;
}
interface SkillGroup {
  id: string;
  category: string;
  description?: string;
  items: SkillItem[];
}

const SkillCategoryManager = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<SkillGroup[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // NEW SKILL GROUP/KEY INFO
  const [newSkillGroup, setNewSkillGroup] = useState({ name: "", description: "" });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  // CATEGORY CRUD
  const [newCategory, setNewCategory] = useState({ category: "" });
  // SKILL ITEM STATE
  const [isAddingSkillItem, setIsAddingSkillItem] = useState(false);
  const [newSkillItem, setNewSkillItem] = useState<SkillItem>({
    name: "",
    description: "",
    iconUrl: "",
    animationType: "scale",
    removeBg: false,
  });
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

  // Handle "New Skill" creation (Skill Group)
  const handleCreateNewSkillGroup = async () => {
    if (!newSkillGroup.name.trim()) {
      toast({
        title: "Error",
        description: "Skill name is required.",
        variant: "destructive",
      });
      return;
    }
    // New collection: category=name, description
    const res = await createSkillGroup(newSkillGroup.name.trim(), []);
    if (res.success) {
      toast({ title: "Success", description: "New skill group created." });
      setNewSkillGroup({ name: "", description: "" });
      fetchCategories();
    } else {
      toast({ title: "Error", description: "Could not create new skill group.", variant: "destructive" });
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

  // SKILL ITEM CRUD
  const handleAddSkillItem = async () => {
    if (!selectedCategory) return;
    if (!newSkillItem.name.trim()) {
      toast({
        title: "Error",
        description: "Item label is required.",
        variant: "destructive",
      });
      return;
    }
    const cat = categories.find(c => c.id === selectedCategory);
    if (!cat) return;
    const updated = [
      ...cat.items,
      {
        name: newSkillItem.name.trim(),
        iconUrl: newSkillItem.iconUrl,
        description: newSkillItem.description,
        animationType: newSkillItem.animationType,
        removeBg: newSkillItem.removeBg,
      }
    ];
    const res = await updateSkillGroup(cat.id, cat.category, updated);
    if (res.success) {
      toast({ title: "Success", description: "Skill item added." });
      setNewSkillItem({
        name: "",
        description: "",
        iconUrl: "",
        animationType: "scale",
        removeBg: false,
      });
      setIsAddingSkillItem(false);
      fetchCategories();
    } else {
      toast({ title: "Error", description: "Could not add skill item.", variant: "destructive" });
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
    setNewSkillItem({ ...categories.find(c => c.id === selectedCategory)!.items[idx] });
  };

  const handleSaveSkillEdit = async () => {
    if (!selectedCategory || editingSkillIdx === null) return;
    const cat = categories.find(c => c.id === selectedCategory);
    if (!cat) return;
    if (!newSkillItem.name.trim()) {
      toast({
        title: "Error",
        description: "Item label is required.",
        variant: "destructive",
      });
      return;
    }
    const updated = cat.items.map((it, i) =>
      i === editingSkillIdx
        ? {
            name: newSkillItem.name.trim(),
            iconUrl: newSkillItem.iconUrl,
            description: newSkillItem.description,
            animationType: newSkillItem.animationType,
            removeBg: newSkillItem.removeBg,
          }
        : it
    );
    const res = await updateSkillGroup(cat.id, cat.category, updated);
    if (res.success) {
      toast({ title: "Success", description: "Skill updated." });
      setEditingSkillIdx(null);
      setNewSkillItem({
        name: "",
        description: "",
        iconUrl: "",
        animationType: "scale",
        removeBg: false,
      });
      fetchCategories();
    } else {
      toast({ title: "Error", description: "Could not update skill.", variant: "destructive" });
    }
  };

  // Image upload flow
  const openFileInput = () => {
    setIconUploadTarget("new");
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
      setNewSkillItem((item) => ({ ...item, iconUrl: url }));
      setIconUploadTarget(null);
    }
  };

  // ---- Render ----

  return (
    <div className="space-y-10">
      {/* NEW SKILL GROUP (like New Collection) */}
      <Card>
        <CardHeader>
          <CardTitle>New Skill</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <label className="font-medium block mb-1" htmlFor="skill-name">Name</label>
            <Input
              id="skill-name"
              placeholder="Skill name"
              value={newSkillGroup.name}
              onChange={(e) => setNewSkillGroup({ ...newSkillGroup, name: e.target.value })}
            />
          </div>
          <div>
            <label className="font-medium block mb-1" htmlFor="skill-desc">Description (optional)</label>
            <Textarea
              id="skill-desc"
              placeholder="Skill group description"
              value={newSkillGroup.description}
              onChange={(e) => setNewSkillGroup({ ...newSkillGroup, description: e.target.value })}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateNewSkillGroup}>Add Skill Group</Button>
        </CardFooter>
      </Card>

      {/* CATEGORY MANAGEMENT */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Manage Skill Categories</h2>
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
              <Button onClick={async () => {
                // Integrate with createSkillGroup for categories if needed
                if (!newCategory.category.trim()) {
                  toast({ title: "Error", description: "Category name is required.", variant: "destructive" });
                  return;
                }
                const res = await createSkillGroup(newCategory.category.trim(), []);
                if (res.success) {
                  toast({ title: "Success", description: "Category added." });
                  setNewCategory({ category: "" });
                  setIsAddingCategory(false);
                  fetchCategories();
                } else {
                  toast({ title: "Error", description: "Unable to add category.", variant: "destructive" });
                }
              }}>Add</Button>
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
                <Badge className="ml-auto">{cat.items.length} items</Badge>
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
      </div>

      {/* SKILL ITEM MANAGEMENT */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Skill Item Management</h2>
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
            <Button onClick={() => {
              setIsAddingSkillItem(!isAddingSkillItem);
              setEditingSkillIdx(null);
              setNewSkillItem({
                name: "",
                description: "",
                iconUrl: "",
                animationType: "scale",
                removeBg: false,
              });
            }} variant="outline">
              {isAddingSkillItem ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {isAddingSkillItem ? "Cancel" : "Add New Item"}
            </Button>
          )}
        </div>
        {selectedCategory && isAddingSkillItem && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-3 items-center">
                <Input
                  value={newSkillItem.name}
                  onChange={e => setNewSkillItem(sk => ({ ...sk, name: e.target.value }))}
                  placeholder="Item label"
                />
                <Input
                  value={newSkillItem.iconUrl || ""}
                  onChange={e => setNewSkillItem(sk => ({ ...sk, iconUrl: e.target.value }))}
                  placeholder="Image URL"
                  className="w-full md:w-[200px]"
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
                  onClick={openFileInput}
                >
                  <Upload className="w-4 h-4" /> Upload Icon
                </Button>
              </div>
              <div className="mt-3 flex flex-col md:flex-row gap-3 items-center">
                <Textarea
                  value={newSkillItem.description || ""}
                  onChange={e => setNewSkillItem(sk => ({ ...sk, description: e.target.value }))}
                  placeholder="Item description (optional)"
                  className="w-full md:w-[350px]"
                />
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-sm font-medium">Animation Type</span>
                  <Input
                    disabled
                    value="Scale"
                    className="w-[85px] text-center"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newSkillItem.removeBg}
                    onCheckedChange={(v) => setNewSkillItem(sk => ({ ...sk, removeBg: v }))}
                    id="remove-bg-toggle"
                  />
                  <label htmlFor="remove-bg-toggle" className="text-sm">Background removal: remove.bg</label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddSkillItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardFooter>
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
                          <CardTitle>Edit Item</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col md:flex-row gap-3 items-center">
                            <Input
                              value={newSkillItem.name}
                              onChange={e => setNewSkillItem(sk => ({ ...sk, name: e.target.value }))}
                              placeholder="Item label"
                            />
                            <Input
                              value={newSkillItem.iconUrl || ""}
                              onChange={e => setNewSkillItem(sk => ({ ...sk, iconUrl: e.target.value }))}
                              placeholder="Image URL"
                              className="w-full md:w-[200px]"
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
                              onClick={openFileInput}
                            >
                              <Upload className="w-4 h-4" /> Upload Icon
                            </Button>
                          </div>
                          <div className="mt-3 flex flex-col md:flex-row gap-3 items-center">
                            <Textarea
                              value={newSkillItem.description || ""}
                              onChange={e => setNewSkillItem(sk => ({ ...sk, description: e.target.value }))}
                              placeholder="Item description (optional)"
                              className="w-full md:w-[350px]"
                            />
                            <div className="flex items-center gap-2">
                              <span className="shrink-0 text-sm font-medium">Animation Type</span>
                              <Input
                                disabled
                                value="Scale"
                                className="w-[85px] text-center"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={newSkillItem.removeBg}
                                onCheckedChange={(v) => setNewSkillItem(sk => ({ ...sk, removeBg: v }))}
                                id="remove-bg-toggle-edit"
                              />
                              <label htmlFor="remove-bg-toggle-edit" className="text-sm">Background removal: remove.bg</label>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="gap-2">
                          <Button type="button" onClick={handleSaveSkillEdit}>
                            <Save className="h-4 w-4 mr-1" /> Save
                          </Button>
                          <Button variant="outline" onClick={() => setEditingSkillIdx(null)}>
                            Cancel
                          </Button>
                        </CardFooter>
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
                        <div className="flex flex-col flex-1">
                          <span className="font-medium">{item.name}</span>
                          {item.description && <span className="text-xs text-muted-foreground">{item.description}</span>}
                          <span className="text-xs">Animation: Scale</span>
                          {item.removeBg && <span className="text-xs text-green-600">BG removed (remove.bg)</span>}
                        </div>
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
                  {categories.find(c => c.id === selectedCategory)?.items.length === 0 && (
                    <div className="text-center col-span-full text-sm text-muted-foreground mt-4">
                      No items in this category yet.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillCategoryManager;
