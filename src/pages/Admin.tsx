
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Save, Trash } from "lucide-react";
import AdminBlogCard from "../components/AdminBlogCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { requireAuth, logout } from "../utils/authUtils";
import { getAllBlogPosts, BlogPost, createBlogPost, updateBlogPost, deleteBlogPost } from "../utils/blogData";
import { useToast } from "../hooks/use-toast";

const Admin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    requireAuth(() => {
      loadPosts();
      
      // Check if we're editing a post from the URL
      const editId = searchParams.get("edit");
      if (editId) {
        const postToEdit = posts.find(post => post.id === editId);
        if (postToEdit) {
          setEditingId(editId);
          setTitle(postToEdit.title);
          setContent(postToEdit.content);
          setImageUrl(postToEdit.imageUrl || "");
          setTags(postToEdit.tags.join(", "));
        }
      }
    });
  }, [searchParams]);

  const loadPosts = async () => {
    try {
      const allPosts = await getAllBlogPosts();
      setPosts(allPosts);
    } catch (error) {
      toast({
        title: "Error Loading Posts",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setImageUrl(post.imageUrl || "");
    setTags(post.tags.join(", "));
  };

  const handleSavePost = async () => {
    if (!title || !content) {
      toast({
        title: "Missing Fields",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const tagArray = tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

      const postData = {
        title,
        content,
        imageUrl: imageUrl || undefined,
        tags: tagArray,
      };

      if (editingId) {
        // Update existing post
        await updateBlogPost(editingId, postData as BlogPost);
        toast({
          title: "Success",
          description: "Blog post updated successfully!",
        });
      } else {
        // Create new post
        await createBlogPost(postData as BlogPost);
        toast({
          title: "Success",
          description: "New blog post created successfully!",
        });
      }

      // Reset form and reload posts
      resetForm();
      loadPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteBlogPost(id);
      toast({
        title: "Success",
        description: "Blog post deleted successfully!",
      });
      loadPosts();
      
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setImageUrl("");
    setTags("");
  };

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <Tabs defaultValue="posts">
          <TabsList className="mb-8">
            <TabsTrigger value="posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="editor">{editingId ? "Edit Post" : "New Post"}</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">All Posts</h2>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </div>

            {posts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No blog posts found. Create your first post!</p>
            ) : (
              <div className="grid gap-6">
                {posts.map((post) => (
                  <AdminBlogCard
                    key={post.id}
                    post={post}
                    onEdit={() => handleEditPost(post)}
                    onDelete={() => handleDeletePost(post.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="editor">
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
                    />
                  </div>

                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                      Image URL (optional)
                    </label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Enter image URL"
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
                    />
                  </div>

                  <div className="flex gap-4 justify-end pt-4">
                    {editingId && (
                      <Button variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                    <Button onClick={handleSavePost}>
                      <Save className="mr-2 h-4 w-4" />
                      {editingId ? "Update" : "Publish"} Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
