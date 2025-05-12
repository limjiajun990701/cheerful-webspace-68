
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FormEvent } from "react";
import { Loader2, Save, AlertCircle, Upload } from "lucide-react";
import { updateSiteContent, uploadSiteImage, setupSiteImagesBucket } from "@/utils/contentUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AboutContent {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  updated_at: string;
  updated_by: string | null;
}

const AboutManager = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState<AboutContent | null>(null);
  const [error, setError] = useState<string | null>(null);
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
        .eq("page_name", "about")
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
      setError(null);
    } catch (error) {
      console.error("Error fetching about content:", error);
      toast({
        title: "Error",
        description: "Failed to fetch about page content",
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

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return content?.image_url || null;
    if (!isBucketReady) {
      setUploadError('Storage bucket is not set up. Contact administrator.');
      return null;
    }
    
    setIsUploading(true);
    try {
      // Use uploadSiteImage helper
      const uploadPath = `about/hero`;
      const imageUrl = await uploadSiteImage(imageFile, uploadPath);
      
      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }
      
      console.log("Successfully uploaded image:", imageUrl);
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
    setError(null);
    
    try {
      // Upload image if there's a new one
      let imageUrl = content.image_url;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
          console.log("New image URL set:", imageUrl);
        } else if (imageFile) {
          // If upload failed but we had a file, show error but continue with other updates
          setUploadError("Image upload failed, but other content was updated");
        }
      }

      // Use updateSiteContent helper
      const updatedContent = {
        ...content,
        image_url: imageUrl,
        updated_by: "admin",
      };

      console.log("Updating content with:", updatedContent);
      const result = await updateSiteContent(content.id, updatedContent);

      if (!result.success) {
        throw new Error("Failed to update content");
      }

      toast({
        title: "Success",
        description: uploadError 
          ? "Content updated but image upload failed" 
          : "Content updated successfully"
      });

      // Refresh content from database
      fetchContent();
      
      // Clear the file input
      setImageFile(null);
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
    field: keyof AboutContent,
    value: string | null
  ) => {
    if (!content) return;
    
    setContent({
      ...content,
      [field]: value,
    });
  };

  const handleImageUrlChange = (url: string) => {
    handleInputChange("image_url", url);
    
    // If URL is empty, clear preview
    if (!url) {
      setImagePreview(null);
      return;
    }
    
    // Set preview and test if the URL works
    setImagePreview(url);
    
    // Create a test image to see if URL is valid
    const img = new Image();
    img.onload = () => setUploadError(null);
    img.onerror = () => setUploadError("Warning: The image URL doesn't appear to be valid");
    img.src = url;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">About Page Management</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit About Page Content</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : content ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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
                    <Label htmlFor="description">Bio Description</Label>
                    <Textarea
                      id="description"
                      value={content.description || ""}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Enter bio description"
                      rows={8}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use line breaks to create paragraphs
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Profile Image</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp"
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
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                    <Input
                      id="imageUrl"
                      value={content.image_url || ""}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      placeholder="Or enter image URL directly"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter a URL to use an existing image
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
                      <div className="border rounded-md overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-auto max-h-[200px] object-contain"
                          onError={() => {
                            setImagePreview(null);
                            setUploadError("Invalid image URL");
                          }}
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
              <p className="text-muted-foreground">No content found for the about page.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutManager;
