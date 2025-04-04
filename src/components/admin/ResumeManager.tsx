
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { getCurrentResume } from "@/utils/resumeData";
import ResumeUploader from "../resume/ResumeUploader";
import ResumeViewer from "../resume/ResumeViewer";

const ResumeManager = () => {
  const [hasResume, setHasResume] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  const checkForResume = async () => {
    try {
      setLoading(true);
      const resume = await getCurrentResume();
      setHasResume(!!resume);
    } catch (error) {
      console.error("Error checking for resume:", error);
      setHasResume(false);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    checkForResume();
  }, []);
  
  const handleUploadSuccess = () => {
    checkForResume();
  };
  
  const handleDelete = () => {
    setHasResume(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ResumeUploader onUploadSuccess={handleUploadSuccess} />
        
        <Separator />
        
        {loading ? (
          <div className="py-4 text-center">Loading resume data...</div>
        ) : hasResume ? (
          <ResumeViewer onDelete={handleDelete} />
        ) : (
          <div className="py-4 text-center">No resume uploaded yet</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeManager;
