
import { ExternalLink, Github, Edit, Trash2, FileText } from "lucide-react";
import { Project } from "../utils/projectData";

interface AdminProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const AdminProjectCard = ({ project, onEdit, onDelete }: AdminProjectCardProps) => {
  // Determine what to display in the media section
  const hasUploadedImage = project.fileUrl && project.fileType === "image";
  const hasUploadedPdf = project.fileUrl && project.fileType === "pdf";
  const displayImage = hasUploadedImage ? project.fileUrl : project.imageUrl;
  
  return (
    <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              {/* Media preview */}
              <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border border-border">
                {displayImage ? (
                  <img 
                    src={displayImage} 
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : hasUploadedPdf ? (
                  <div className="h-full w-full flex items-center justify-center bg-muted/30">
                    <FileText size={24} className="text-muted-foreground" />
                  </div>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted/30">
                    <span className="text-xs text-muted-foreground">No Image</span>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {project.description}
                </p>
              </div>
            </div>
            
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
              
              {hasUploadedPdf && project.fileUrl && (
                <a 
                  href={project.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <FileText size={16} />
                  PDF
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
