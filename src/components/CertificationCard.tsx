
import { Award, ExternalLink, FileText } from "lucide-react";
import { Certification } from "../types/database";

interface CertificationCardProps {
  certification: Certification;
}

const CertificationCard = ({ certification }: CertificationCardProps) => {
  return (
    <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border border-border">
            {certification.filetype === "image" ? (
              <img 
                src={certification.fileurl} 
                alt={certification.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-muted/30">
                <FileText size={24} className="text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{certification.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Award size={16} className="mr-1" />
              <span>{certification.issuer}</span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {certification.description}
            </p>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {new Date(certification.date).toLocaleDateString()}
              </span>
              
              {certification.credentialurl && (
                <a 
                  href={certification.credentialurl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink size={14} />
                  View Credential
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationCard;
