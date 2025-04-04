
import { useState } from "react";
import { FileUp, FileText, Trash2, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { useToast } from "../../hooks/use-toast";
import { getCurrentResume, uploadResume, deleteResume } from "../../utils/resumeData";
import { format } from "date-fns";

const ResumeManager = () => {
  const [resume, setResume] = useState(getCurrentResume);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check file type
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const newResume = await uploadResume(file);
      setResume(newResume);
      toast({
        title: "Resume updated",
        description: "Your resume has been successfully updated.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    deleteResume();
    setResume(getCurrentResume());
    toast({
      title: "Resume deleted",
      description: "Your resume has been deleted.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            type="file"
            id="resume-upload"
            accept="application/pdf"
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
          <label htmlFor="resume-upload">
            <Button
              variant="outline"
              className="w-full sm:w-auto cursor-pointer"
              disabled={isUploading}
              asChild
            >
              <span>
                <FileUp className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload PDF Resume"}
              </span>
            </Button>
          </label>
          <p className="text-sm text-muted-foreground mt-2">
            Upload a PDF file for your resume.
          </p>
        </div>

        <Separator />

        {resume && (
          <div className="space-y-4">
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
                    <FileText className="h-4 w-4 mr-1" />
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
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeManager;
