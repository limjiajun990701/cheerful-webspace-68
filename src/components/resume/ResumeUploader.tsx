
import { useState } from "react";
import { FileUp, AlertCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadResume } from "@/utils/resumeData";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const ResumeUploader = ({ onUploadSuccess }: { onUploadSuccess: () => void }) => {
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
      await uploadResume(file);
      toast({
        title: "Resume updated",
        description: "Your resume has been successfully uploaded.",
      });
      onUploadSuccess();
    } catch (error: any) {
      console.error("Upload error:", error);
      
      // Check if it's an authentication error
      if (error?.name === "AuthenticationRequiredError" || 
          error?.message?.includes("authentication") || 
          error?.message?.includes("sign in")) {
        toast({
          title: "Authentication Required",
          description: (
            <div className="flex flex-col gap-2">
              <p>You need to be signed in to upload a resume.</p>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            </div>
          ),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Upload failed",
          description: "Failed to upload resume. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
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
        <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          <span>Only PDF files are accepted</span>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploader;
