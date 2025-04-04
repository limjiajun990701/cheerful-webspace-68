
import { useState, useEffect } from "react";
import { FileText, Download, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentResume, deleteResume } from "@/utils/resumeData";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Resume } from "@/types/resume";

interface ResumeViewerProps {
  onDelete?: () => void;
  showActions?: boolean;
}

const ResumeViewer = ({ onDelete, showActions = true }: ResumeViewerProps) => {
  const [resume, setResume] = useState<Resume | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setResume(getCurrentResume());
  }, []);

  if (!resume) {
    return <div>No resume available</div>;
  }

  const handleDelete = () => {
    deleteResume();
    setResume(getCurrentResume());
    toast({
      title: "Resume deleted",
      description: "Your resume has been deleted.",
    });
    if (onDelete) onDelete();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">{resume.fileName}</p>
              <p className="text-sm text-muted-foreground">
                Last updated: {format(new Date(resume.uploadDate), "MMM d, yyyy")}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              asChild
            >
              <a 
                href={resume.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View
              </a>
            </Button>
            <Button
              size="sm"
              variant="outline"
              asChild
            >
              <a 
                href={resume.fileUrl} 
                download={resume.fileName}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </a>
            </Button>
            {showActions && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeViewer;
