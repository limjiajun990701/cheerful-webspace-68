
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
}

const ProjectCard = ({ 
  title, 
  description, 
  imageUrl, 
  tags, 
  liveUrl, 
  githubUrl 
}: ProjectCardProps) => {
  return (
    <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all">
      <div className="aspect-video relative overflow-hidden bg-muted">
        <div 
          className="absolute inset-0 bg-muted flex items-center justify-center"
          style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {!imageUrl && <span className="text-muted-foreground">Project Image</span>}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-3">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="px-3 py-1 bg-secondary text-foreground/90 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex gap-3">
          {liveUrl && (
            <Button asChild size="sm">
              <a 
                href={liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink size={16} className="mr-1.5" />
                Live Demo
              </a>
            </Button>
          )}
          
          {githubUrl && (
            <Button asChild variant="outline" size="sm">
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Github size={16} className="mr-1.5" />
                View Code
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
