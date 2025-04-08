
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import AdminBlogCard from "../AdminBlogCard";
import { getAllBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost } from "../../utils/blogData";
import { BlogPost } from "../../types/database";
import BlogPostEditor from "./BlogPostEditor";

const BlogPostManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

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

  const handleEditPost = (post: BlogPost) => {
    setEditingId(post.id);
    setIsEditing(true);
  };

  const handleSavePost = async (postData: Omit<BlogPost, 'id' | 'date' | 'excerpt'>) => {
    try {
      // Create an excerpt from the content
      const excerpt = postData.content.substring(0, 150) + (postData.content.length > 150 ? '...' : '');
      
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (editingId) {
        // Update existing post
        await updateBlogPost({
          id: editingId,
          title: postData.title,
          content: postData.content,
          tags: postData.tags,
          date,
          excerpt,
          imageurl: postData.imageurl
        });
        
        toast({
          title: "Success",
          description: "Blog post updated successfully!",
        });
      } else {
        // Create new post
        await addBlogPost({
          title: postData.title,
          content: postData.content,
          tags: postData.tags,
          date,
          excerpt,
          imageurl: postData.imageurl
        });
        
        toast({
          title: "Success",
          description: "New blog post created successfully!",
        });
      }

      // Reset form and reload posts
      resetPostForm();
      loadPosts();
    } catch (error) {
      console.error("Error saving post:", error);
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
        resetPostForm();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetPostForm = () => {
    setEditingId(null);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <BlogPostEditor 
          editingId={editingId}
          onSave={handleSavePost}
          onCancel={resetPostForm}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Posts</h2>
            <Button onClick={() => setIsEditing(true)}>
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
        </>
      )}
    </div>
  );
};

export default BlogPostManager;
