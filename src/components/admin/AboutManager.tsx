
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FormEvent } from "react";
import { Loader2, Save, AlertCircle } from "lucide-react";
import { updateSiteContent } from "@/utils/contentUtils";
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

      if (error) {
        throw error;
      }

      setContent(data);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!content) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Use updateSiteContent helper
      const updatedContent = {
        ...content,
        updated_by: "admin",
      };

      const result = await updateSiteContent(content.id, updatedContent);

      if (!result.success) {
        throw new Error("Failed to update content");
      }

      toast({
        title: "Success",
        description: "About page content updated successfully"
      });

      // Refresh content from database
      fetchContent();
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
                
                <div className="pt-4">
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(content.updated_at).toLocaleString()} by {content.updated_by || "unknown"}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSaving}
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
