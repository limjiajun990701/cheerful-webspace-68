
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { getCurrentResume } from "../../utils/resumeData";
import ResumeUploader from "../resume/ResumeUploader";
import ResumeViewer from "../resume/ResumeViewer";

const ResumeManager = () => {
  const [hasResume, setHasResume] = useState(!!getCurrentResume());
  
  const handleUploadSuccess = () => {
    setHasResume(true);
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
        
        {hasResume && (
          <ResumeViewer onDelete={handleDelete} />
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeManager;
