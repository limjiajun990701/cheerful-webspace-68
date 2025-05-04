
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormEvent } from "react";
import { Loader2, Save, Upload } from "lucide-react";

interface SiteContent {
  id: string;
  page_name: string;
  section_name: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  updated_at: string;
  updated_by: string | null;
}

const ContentManager = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [sections, setSections] = useState<string[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pages = ["home", "about", "experience"];

  useEffect(() => {
    if (selectedPage) {
      fetchSections(selectedPage);
    }
  }, [selectedPage]);

  useEffect(() => {
    if (selectedPage && selectedSection) {
      fetchContent(selectedPage, selectedSection);
    }
  }, [selectedPage, selectedSection]);

  const fetchSections = async (page: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("section_name")
        .eq("page_name", page);

      if (error) {
        throw error;
      }

      const sectionNames = data.map(item => item.section_name);
      setSections(sectionNames);
      
      if (sectionNames.length > 0) {
        setSelectedSection(sectionNames[0]);
      } else {
        setSelectedSection("");
        setContent(null);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast({
        title: "Error",
        description: "Failed to fetch sections",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContent = async (page: string, section: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("page_name", page)
        .eq("section_name", section)
        .single();

      if (error) {
        throw error;
      }

      setContent(data);
      if (data.image_url) {
        setImagePreview(data.image_url);
      } else {
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive",
      });
      setContent(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return content?.image_url || null;
    
    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `site-content/${selectedPage}/${selectedSection}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("site-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("site-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!content || !selectedPage || !selectedSection) return;
    
    setIsSaving(true);
    try {
      // Upload image if there's a new one
      let imageUrl = content.image_url;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const updatedContent = {
        ...content,
        image_url: imageUrl,
        updated_by: "admin", // Replace with actual admin username when available
      };

      const { error } = await supabase
        .from("site_content")
        .update(updatedContent)
        .eq("id", content.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Content updated successfully",
      });

      // Refresh content from database
      fetchContent(selectedPage, selectedSection);
    } catch (error) {
      console.error("Error updating content:", error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof SiteContent,
    value: string | null
  ) => {
    if (!content) return;
    
    setContent({
      ...content,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Content Management</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Site Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="page">Select Page</Label>
              <Select 
                value={selectedPage}
                onValueChange={setSelectedPage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Page" />
                </SelectTrigger>
                <SelectContent>
                  {pages.map((page) => (
                    <SelectItem key={page} value={page}>
                      {page.charAt(0).toUpperCase() + page.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="section">Select Section</Label>
              <Select 
                value={selectedSection}
                onValueChange={setSelectedSection}
                disabled={sections.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : content ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={content.title || ""}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={content.subtitle || ""}
                      onChange={(e) => handleInputChange("subtitle", e.target.value)}
                      placeholder="Enter subtitle"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={content.description || ""}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Enter description"
                      rows={5}
                      className="resize-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Image</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                      />
                      {isUploading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                      <div className="border rounded-md overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-auto max-h-[200px] object-contain"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(content.updated_at).toLocaleString()} by {content.updated_by || "unknown"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSaving || isUploading}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No content found for the selected page and section.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManager;
