
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CalendarIcon, Edit, ArrowLeft } from "lucide-react";
import { getBlogPostById, BlogPost } from "../utils/blogData";
import { isAuthenticated } from "../utils/authUtils";

// Simple markdown renderer - in a real app, use a library like react-markdown
const renderMarkdown = (markdown: string) => {
  return { __html: markdown
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold my-6">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold my-5">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold my-4">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
    .replace(/```(.*?)```/gs, '<pre class="bg-muted p-4 rounded-lg my-4 overflow-x-auto text-sm">$1</pre>')
  };
};

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const isAdmin = isAuthenticated();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) {
          throw new Error("Post ID is required");
        }

        const fetchedPost = await getBlogPostById(id);
        
        if (!fetchedPost) {
          throw new Error("Post not found");
        }
        
        setPost(fetchedPost);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
        console.error("Error fetching blog post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center py-12">
            <div className="animate-pulse">Loading article...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || "The article you're looking for doesn't exist or has been removed."}
            </p>
            <Link 
              to="/blog" 
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors gap-1"
            >
              <ArrowLeft size={18} />
              Back to all posts
            </Link>
            
            {isAdmin && (
              <Link 
                to={`/admin?edit=${post.id}`} 
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Edit size={16} />
                Edit Post
              </Link>
            )}
          </div>
          
          {post.imageUrl && (
            <div className="w-full aspect-video rounded-xl overflow-hidden mb-8 bg-muted">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="mb-6">
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <CalendarIcon size={16} className="mr-1" />
              <span>{post.date}</span>
              
              <span className="mx-2">•</span>
              
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-2.5 py-1 bg-secondary text-foreground/90 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
          </div>
          
          <article className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={renderMarkdown(post.content)} />
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
