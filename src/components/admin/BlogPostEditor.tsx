
import { useState, useEffect, useRef } from "react";
import { Plus, Save, Upload, X } from "lucide-react";
import { BlogPost, getBlogPostById } from "../../utils/blogData";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { useToast } from "../../hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface BlogPostEditorProps {
  editingId: string | null;
  onSave: (post: Omit<BlogPost, 'id' | 'date' | 'excerpt'>) => void;
  onCancel: () => void;
}

const BlogPostEditor = ({ editingId, onSave, onCancel }: BlogPostEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
            if (post.imageUrl) {
              setImagePreview(post.imageUrl);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const fileType = file.type.split('/')[1];
    const allowedTypes = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
    
    if (!allowedTypes.includes(fileType)) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (JPG, PNG, WebP, GIF)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setShowImageDialog(false);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

    // In a real app with Supabase, the image would be uploaded to storage
    // and the URL would be saved. For now, we'll use the imagePreview
    onSave({
      title,
      content,
      imageUrl: imagePreview || undefined,
      tags: tagArray,
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
            <label className="block text-sm font-medium mb-1">
              Featured Image (optional)
            </label>
            <div className="mt-1">
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover"
                  />
                  <button
                    className="absolute top-2 right-2 bg-background/80 rounded-full p-1 hover:bg-destructive/20 transition-colors"
                    onClick={removeImage}
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-8 border-dashed flex flex-col items-center gap-2"
                  onClick={triggerFileInput}
                  disabled={isLoading}
                >
                  <Upload size={24} />
                  <span>Upload image</span>
                  <span className="text-xs text-muted-foreground">JPG, PNG, WebP (max 5MB)</span>
                </Button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
              />
            </div>
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

      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full py-8 border-dashed flex flex-col items-center gap-2"
              onClick={triggerFileInput}
            >
              <Upload size={24} />
              <span>Click to browse</span>
              <span className="text-xs text-muted-foreground">JPG, PNG, WebP (max 5MB)</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BlogPostEditor;
