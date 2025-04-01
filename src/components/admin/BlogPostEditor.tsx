
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { BlogPost, getBlogPostById } from "../../utils/blogData";
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

    onSave({
      title,
      content,
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
    </Card>
  );
};

export default BlogPostEditor;
