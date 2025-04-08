
import { Award, ExternalLink, Edit, Trash2, FileText } from "lucide-react";
import { Certification } from "../types/database";

interface AdminCertificationCardProps {
  certification: Certification;
  onEdit: (certification: Certification) => void;
  onDelete: (id: string) => void;
}

const AdminCertificationCard = ({ certification, onEdit, onDelete }: AdminCertificationCardProps) => {
  return (
    <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
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
              
              <div>
                <h3 className="text-xl font-semibold mb-1">{certification.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Award size={16} className="mr-1" />
                  <span>{certification.issuer}</span>
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-3 line-clamp-2">
              {certification.description}
            </p>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Issued: {new Date(certification.date).toLocaleDateString()}
              </p>
              
              {certification.credentialurl && (
                <a 
                  href={certification.credentialurl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink size={16} />
                  View Credential
                </a>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onEdit(certification)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-foreground"
              aria-label="Edit certification"
            >
              <Edit size={18} />
            </button>
            
            <button
              onClick={() => onDelete(certification.id)}
              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
              aria-label="Delete certification"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCertificationCard;
