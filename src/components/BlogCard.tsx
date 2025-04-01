
import { CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogPost } from "../utils/blogData";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  return featured ? (
    <div className="bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-border">
      <div className="p-6 flex flex-col">
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <CalendarIcon size={16} className="mr-1" />
          <span>{post.date}</span>
        </div>
        
        <h3 className="text-2xl font-semibold mb-3">{post.title}</h3>
        
        <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span 
              key={tag} 
              className="px-2.5 py-1 bg-secondary text-foreground/90 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <Link 
          to={`/blog/${post.id}`} 
          className="inline-flex items-center text-primary hover:underline underline-animation gap-1 mt-auto"
        >
          Read Article
        </Link>
      </div>
    </div>
  ) : (
    <div className="bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-border h-full flex flex-col">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <CalendarIcon size={16} className="mr-1" />
          <span>{post.date}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
        
        <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span 
              key={tag} 
              className="px-2.5 py-1 bg-secondary text-foreground/90 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <Link 
          to={`/blog/${post.id}`} 
          className="inline-flex items-center text-primary hover:underline underline-animation gap-1 mt-auto"
        >
          Read Article
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
