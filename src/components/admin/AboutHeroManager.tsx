
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Image as ImageIcon, Save } from "lucide-react";

const DEFAULT_TITLE = "About Me";
const DEFAULT_SUBTITLE = "Get to know me";
const DEFAULT_DESC = "This is my About Hero section. Edit me in the Admin panel.";
const DEFAULT_IMAGE_URL = "";

export default function AboutHeroManager() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("page_name", "about")
        .eq("section_name", "hero")
        .single();

      if (!error) {
        setContent(data);
        setImagePreview(data?.image_url || null);
      } else {
        setContent({
          title: DEFAULT_TITLE,
          subtitle: DEFAULT_SUBTITLE,
          description: DEFAULT_DESC,
          image_url: DEFAULT_IMAGE_URL,
        });
        setImagePreview(DEFAULT_IMAGE_URL);
      }
      setUploadError(null);
    } catch (error) {
      setContent({
        title: DEFAULT_TITLE,
        subtitle: DEFAULT_SUBTITLE,
        description: DEFAULT_DESC,
        image_url: DEFAULT_IMAGE_URL,
      });
      setUploadError("Failed to fetch content.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | null
  ) => {
    setContent({
      ...content,
      [field]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setUploadError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return content?.image_url || null;
    try {
      const path = `about/hero/${imageFile.name}`;
      const { data, error } = await supabase.storage
        .from("site-images")
        .upload(path, imageFile, { upsert: true });
      if (error) throw error;
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("site-images")
        .getPublicUrl(path);
      return urlData?.publicUrl || null;
    } catch (error: any) {
      setUploadError(error?.message || "Failed to upload.");
      toast({
        title: "Upload Error",
        description: error?.message || "Failed to upload image.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content) return;
    setIsSaving(true);
    setUploadError(null);

    try {
      let imageUrl = content.image_url;
      if (imageFile) {
        imageUrl = await uploadImage();
      }
      const toSave = {
        ...content,
        image_url: imageUrl,
        page_name: "about",
        section_name: "hero",
        updated_by: "admin",
      };

      // Upsert (insert or update)
      const { error } = await supabase
        .from("site_content")
        .upsert([toSave], { onConflict: "page_name,section_name" });

      if (error) throw error;

      toast({
        title: "Saved",
        description: "About Hero section updated.",
      });
      fetchContent();
      setImageFile(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update content",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage About Hero Section</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Input
                value={content.title || ""}
                onChange={e => handleInputChange("title", e.target.value)}
                placeholder="Title (e.g. About Me)"
              />
              <Input
                value={content.subtitle || ""}
                onChange={e => handleInputChange("subtitle", e.target.value)}
                placeholder="Subtitle"
              />
              <Textarea
                value={content.description || ""}
                rows={4}
                onChange={e => handleInputChange("description", e.target.value)}
                placeholder="Description"
              />
            </div>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview &&
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="w-36 h-36 rounded-lg object-cover border" />
                </div>
              }
              {uploadError && (
                <div className="text-destructive text-sm mt-2">{uploadError}</div>
              )}
            </div>
            <Button type="submit" disabled={isSaving} className="flex gap-2 items-center">
              {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
