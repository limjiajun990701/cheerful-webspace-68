
import { useState, useEffect, ChangeEvent } from "react";
import { Save, Upload, X } from "lucide-react";
import { getBlogPostById } from "../../utils/blogData";
import { BlogPost } from "../../types/database";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { useToast } from "../../hooks/use-toast";

interface BlogPostEditorProps {
  editingId: string | null;
  onSave: (post: Omit<BlogPost, 'id' | 'date' | 'excerpt'>) => void;
  onCancel: () => void;
}

const BlogPostEditor = ({ editingId, onSave, onCancel }: BlogPostEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load post data when editing an existing post
  useEffect(() => {
    const loadPostData = async () => {
      if (editingId) {
        setIsLoading(true);
        try {
          const post = await getBlogPostById(editingId);
          
          if (post) {
            setTitle(post.title);
            setContent(post.content);
            setTags(post.tags.join(", "));
            setImageUrl(post.imageurl || "");
            if (post.imageurl) {
              setImagePreview(post.imageurl);
            }
          }
        } catch (error) {
          console.error("Error loading post data:", error);
          toast({
            title: "Error",
            description: "Failed to load post data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadPostData();
  }, [editingId, toast]);

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, WebP, or GIF image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      // Clear image URL when an image is uploaded
      setImageUrl("");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageUrl("");
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    if (url) {
      // If URL is provided, clear the uploaded file
      setImageFile(null);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSave = () => {
    if (!title || !content) {
      toast({
        title: "Missing Fields",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }

    const tagArray = tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag !== "");
      
    // In a real-world scenario with Supabase integration, we'd upload the image here
    // For this example, we'll use the imageUrl or the base64 preview as a placeholder
    const finalImageUrl = imageUrl || imagePreview || undefined;

    onSave({
      title,
      content,
      tags: tagArray,
      imageurl: finalImageUrl
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Post Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content *
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here (Markdown supported)"
              className="min-h-[300px]"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-1">
              Tags (comma separated)
            </label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. technology, design, react"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Post Image (optional)
            </label>
            <div className="space-y-3">
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="Enter image URL"
                disabled={isLoading || !!imageFile}
              />
              
              <div className="flex items-center">
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="mr-2"
                    disabled={isLoading || !!imageUrl}
                    onClick={() => document.getElementById('imageUpload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    onChange={handleImageFileChange}
                    disabled={isLoading || !!imageUrl}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  JPG, PNG, WebP or GIF (max 5MB)
                </span>
              </div>
              
              {imagePreview && (
                <div className="relative w-full max-w-[300px] h-auto mt-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-auto rounded-md border border-border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4">
            {editingId && (
              <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {editingId ? "Update" : "Publish"} Post
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostEditor;
