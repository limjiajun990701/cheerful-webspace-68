
import { CalendarIcon, Edit, Trash2 } from "lucide-react";
import { BlogPost } from "../utils/blogData";

interface AdminBlogCardProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}

const AdminBlogCard = ({ post, onEdit, onDelete }: AdminBlogCardProps) => {
  return (
    <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <CalendarIcon size={16} className="mr-1" />
              <span>{post.date}</span>
            </div>
            
            <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
            
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {post.excerpt}
            </p>
            
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
          
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onEdit(post)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-foreground"
              aria-label="Edit blog post"
            >
              <Edit size={18} />
            </button>
            
            <button
              onClick={() => onDelete(post.id)}
              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
              aria-label="Delete blog post"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogCard;
