
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Image as ImageIcon, Save, AlertCircle } from "lucide-react";
import { uploadSiteImage, updateSiteContent } from "@/utils/contentUtils";

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
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");

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
        if (data?.image_url) {
          setImagePreview(data.image_url);
          setImageUrl(data.image_url);
        } else {
          setImagePreview(null);
          setImageUrl("");
        }
      } else {
        setContent({
          title: DEFAULT_TITLE,
          subtitle: DEFAULT_SUBTITLE,
          description: DEFAULT_DESC,
          image_url: DEFAULT_IMAGE_URL,
        });
        setImagePreview(DEFAULT_IMAGE_URL);
        setImageUrl("");
      }
      setUploadError(null);
    } catch (error) {
      console.error("Error fetching content:", error);
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

  const handleInputChange = (field: string, value: string | null) => {
    setContent({
      ...content,
      [field]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'];
    const fileType = file.type;
    
    if (!acceptedFormats.includes(fileType)) {
      setUploadError('Please select a valid image file (JPEG, PNG, GIF, WEBP, SVG, BMP)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    setUploadError(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
    setUploadError(null);
  };

  const handleImageModeChange = (mode: "upload" | "url") => {
    setImageMode(mode);
    // Clear the other mode's data
    if (mode === "upload") {
      setImageUrl("");
    } else {
      setImageFile(null);
    }
    setUploadError(null);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (imageMode === "url") {
      return imageUrl || content?.image_url || null;
    }
    
    if (!imageFile) return content?.image_url || null;
    
    setIsUploading(true);
    try {
      const uploadPath = 'about/hero';
      const imageUrl = await uploadSiteImage(imageFile, uploadPath);
      
      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }

      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content) return;
    
    setIsSaving(true);
    setUploadError(null);

    try {
      const newImageUrl = await uploadImage();

      // If a file was selected but the upload failed (returned null)
      if (imageMode === "upload" && imageFile && !newImageUrl) {
        toast({
          title: "Image Upload Failed",
          description: uploadError || "The content was not saved because the image failed to upload.",
          variant: "destructive"
        });
        setIsSaving(false);
        return; // Abort the save
      }

      const updatedContent = {
        ...content,
        image_url: newImageUrl,
        page_name: "about",
        section_name: "hero",
        updated_by: "admin",
      };

      const result = await updateSiteContent(updatedContent);

      if (result.error) {
        throw new Error(result.error.message || "Failed to update content");
      }

      toast({
        title: "Success",
        description: "About Hero section updated successfully.",
      });
      
      fetchContent();
      setImageFile(null);
    } catch (error: any) {
      console.error("Error updating content:", error);
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
            {uploadError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={content.title || ""}
                    onChange={e => handleInputChange("title", e.target.value)}
                    placeholder="Title (e.g. About Me)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={content.subtitle || ""}
                    onChange={e => handleInputChange("subtitle", e.target.value)}
                    placeholder="Subtitle"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={content.description || ""}
                    rows={6}
                    onChange={e => handleInputChange("description", e.target.value)}
                    placeholder="Description"
                    className="resize-none"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Image</Label>
                  
                  <Tabs value={imageMode} onValueChange={(value) => handleImageModeChange(value as "upload" | "url")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">Upload File</TabsTrigger>
                      <TabsTrigger value="url">Image URL</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full"
                        />
                        {isUploading && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Supports: JPG, PNG, GIF, WEBP, SVG, BMP (Max: 5MB)
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="url" className="space-y-2">
                      <Input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                        placeholder="Enter image URL"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter a direct URL to an image hosted elsewhere
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {imagePreview ? (
                  <div className="mt-4 border rounded-md p-4 bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Image Preview:</p>
                      {content.image_url && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(content.image_url || '', '_blank')}
                          className="text-xs"
                        >
                          View Full Size
                        </Button>
                      )}
                    </div>
                    <div className="border rounded-md overflow-hidden bg-card">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-auto max-h-[200px] object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 border rounded-md p-6 flex flex-col items-center justify-center bg-muted/30">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">No image selected</p>
                    <p className="text-xs text-muted-foreground/70">
                      Upload an image or provide a URL
                    </p>
                  </div>
                )}
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
                    Save
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
