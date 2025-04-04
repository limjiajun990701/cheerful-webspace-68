
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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const data = await getCurrentResume();
        setResume(data);
      } catch (error) {
        console.error("Error fetching resume:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteResume();
      setResume(null);
      toast({
        title: "Resume deleted",
        description: "Your resume has been deleted from Supabase.",
      });
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast({
        title: "Error",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-4">
            <p>Loading resume...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!resume) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-4">
            <p>No resume available. Please upload one.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">{resume.fileName || resume.file_name}</p>
              <p className="text-sm text-muted-foreground">
                Last updated: {format(new Date(resume.upload_date), "MMM d, yyyy")}
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
                download={resume.fileName || resume.file_name}
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
