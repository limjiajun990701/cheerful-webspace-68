
import { ExternalLink, Github, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  fileUrl?: string;
  fileType?: "image" | "pdf";
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
}

const ProjectCard = ({ 
  title, 
  description, 
  imageUrl, 
  fileUrl,
  fileType,
  tags, 
  liveUrl, 
  githubUrl 
}: ProjectCardProps) => {
  // Determine what to display in the media section
  const displayImage = fileUrl && fileType === "image" ? fileUrl : imageUrl;
  const isPdf = fileUrl && fileType === "pdf";
  const hasTransparentBg = displayImage?.includes("data:image/png;base64,");
  
  return (
    <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all">
      <AspectRatio ratio={16/9} className={cn(
        "bg-muted relative",
        hasTransparentBg && "bg-gradient-to-r from-secondary/30 to-background"
      )}>
        {displayImage ? (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              backgroundImage: hasTransparentBg ? 'none' : `url(${displayImage})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center' 
            }}
          >
            {hasTransparentBg && (
              <img 
                src={displayImage} 
                alt={title}
                className="max-h-full max-w-full object-contain" 
              />
            )}
          </div>
        ) : isPdf ? (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <FileText size={48} className="text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">PDF Document</span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Project Image</span>
          </div>
        )}
      </AspectRatio>
      
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
          
          {isPdf && fileUrl && (
            <Button asChild variant="outline" size="sm">
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FileText size={16} className="mr-1.5" />
                View PDF
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
