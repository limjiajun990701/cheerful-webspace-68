
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FormEvent } from "react";
import { Loader2, Save, AlertCircle, Image as ImageIcon } from "lucide-react";
import { uploadSiteImage, updateSiteContent, setupSiteImagesBucket } from "@/utils/contentUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface HomeContent {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  updated_at: string;
  updated_by: string | null;
  import_url: string | null;
}

const HomeManager = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState<HomeContent | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isBucketReady, setIsBucketReady] = useState<boolean>(false);

  useEffect(() => {
    const checkBucketStatus = async () => {
      const status = await setupSiteImagesBucket();
      setIsBucketReady(status);
      
      if (!status) {
        toast({
          title: "Storage Setup Required",
          description: "Storage setup is required for image uploads. Contact administrator.",
          variant: "destructive",
        });
      }
    };
    
    checkBucketStatus();
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("page_name", "home")
        .eq("section_name", "hero")
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
      setUploadError(null);
    } catch (error) {
      console.error("Error fetching home content:", error);
      toast({
        title: "Error",
        description: "Failed to fetch home page content",
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

    // Validate file type - support multiple image formats
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

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return content?.image_url || null;
    if (!isBucketReady) {
      setUploadError('Storage bucket is not set up. Contact administrator.');
      return null;
    }
    
    setIsUploading(true);
    try {
      // Use uploadSiteImage helper
      const uploadPath = 'home/hero';
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content) return;
    
    setIsSaving(true);
    setUploadError(null);
    
    try {
      const newImageUrl = await uploadImage();

      // If a file was selected but the upload failed (returned null)
      if (imageFile && !newImageUrl) {
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
        import_url: content.import_url || null,
        updated_by: "admin",
      };

      const result = await updateSiteContent(updatedContent);

      if (result.error) {
        throw new Error(result.error.message || "Failed to update content");
      }

      toast({
        title: "Success",
        description: "Home page content updated successfully.",
      });

      // Refresh content from database
      await fetchContent();
      
      // Clear the file input state
      setImageFile(null);
    } catch (error) {
      console.error("Error updating content:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update content";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof HomeContent,
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
        <h2 className="text-2xl font-bold">Home Page Management</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Home Page Hero</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : content ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {uploadError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={content.title || ""}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={content.subtitle || ""}
                      onChange={(e) =>
                        handleInputChange("subtitle", e.target.value)
                      }
                      placeholder="Enter subtitle"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={content.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Enter description"
                      rows={5}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="import_url">Import URL</Label>
                    <Input
                      id="import_url"
                      type="url"
                      value={content.import_url || ""}
                      onChange={(e) =>
                        handleInputChange("import_url", e.target.value)
                      }
                      placeholder="Enter import URL (optional)"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Set an optional URL to import additional content/data for the home page.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">
                      Hero Background Image
                      <span className="text-xs text-muted-foreground ml-2">
                        (Will be displayed with overlay on homepage)
                      </span>
                    </Label>
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports: JPG, PNG, GIF, WEBP, SVG, BMP (Max: 5MB)
                    </p>
                  </div>
                  
                  {imagePreview && (
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
                      <p className="text-xs text-muted-foreground mt-2">
                        This image will appear with a subtle overlay as the homepage hero background
                      </p>
                    </div>
                  )}
                  
                  {!imagePreview && (
                    <div className="mt-4 border rounded-md p-6 flex flex-col items-center justify-center bg-muted/30">
                      <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
                      <p className="text-sm text-muted-foreground">No image selected</p>
                      <p className="text-xs text-muted-foreground/70">
                        Upload an image to use as the homepage hero background
                      </p>
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
              <p className="text-muted-foreground">No content found for the home page.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeManager;
