
import { ExternalLink, Github, Edit, Trash2 } from "lucide-react";
import { Project } from "../utils/projectData";

interface AdminProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const AdminProjectCard = ({ project, onEdit, onDelete }: AdminProjectCardProps) => {
  return (
    <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
            
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-2.5 py-1 bg-secondary text-foreground/90 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex gap-3">
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink size={16} />
                  Demo
                </a>
              )}
              
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Github size={16} />
                  Code
                </a>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onEdit(project)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-foreground"
              aria-label="Edit project"
            >
              <Edit size={18} />
            </button>
            
            <button
              onClick={() => onDelete(project.id)}
              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
              aria-label="Delete project"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectCard;
