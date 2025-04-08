
import { useState, useEffect, useRef } from "react";
import { Award, Save, Upload, File, FileText, X } from "lucide-react";
import { Certification, getCertificationById, uploadCertificationFile } from "../../utils/certificationData";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { useToast } from "../../hooks/use-toast";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface CertificationEditorProps {
  editingId: string | null;
  onSave: (certification: Omit<Certification, 'id'>) => void;
  onCancel: () => void;
}

const CertificationEditor = ({ editingId, onSave, onCancel }: CertificationEditorProps) => {
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState<"image" | "pdf">("image");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load certification data when editing an existing certification
  useEffect(() => {
    const loadCertificationData = async () => {
      if (editingId) {
        setIsLoading(true);
        try {
          const certification = await getCertificationById(editingId);
          
          if (certification) {
            setName(certification.name);
            setIssuer(certification.issuer);
            setFileUrl(certification.fileurl || "");
            setFileType(certification.filetype || "image");
            setDescription(certification.description || "");
            setDate(certification.date);
            setCredentialUrl(certification.credentialurl || "");
          }
        } catch (error) {
          console.error("Error loading certification data:", error);
          toast({
            title: "Error",
            description: "Failed to load certification data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadCertificationData();
  }, [editingId, toast]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setSelectedFile(file);
    
    // Check if file is valid
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    
    if (!isImage && !isPDF) {
      toast({
        title: "Invalid file format",
        description: "Please upload an image (JPG, PNG, WebP, etc.) or PDF file.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // In a real app, this would upload to a server/storage
      const { url, fileType: detectedType } = await uploadCertificationFile(file);
      
      setFileUrl(url);
      setFileType(detectedType);
      
      toast({
        title: "File uploaded",
        description: "Your file has been successfully uploaded.",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (!name || !issuer || !date) {
      toast({
        title: "Missing Fields",
        description: "Name, issuer, and date are required.",
        variant: "destructive",
      });
      return;
    }

    if (!fileUrl) {
      toast({
        title: "Missing File",
        description: "Please upload a certification file (image or PDF).",
        variant: "destructive",
      });
      return;
    }

    onSave({
      name,
      issuer,
      fileurl: fileUrl,
      filetype: fileType,
      description,
      date,
      credentialurl: credentialUrl || undefined,
    });
  };

  const handleClearFile = () => {
    setFileUrl("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFilePreview = () => {
    if (!fileUrl) return null;

    if (fileType === "image") {
      return (
        <div className="relative h-32 w-full max-w-[200px] border border-border rounded-md overflow-hidden bg-muted/30">
          <img 
            src={fileUrl} 
            alt="Certificate preview" 
            className="h-full w-full object-contain" 
          />
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2 p-4 border border-border rounded-md bg-muted/30">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <div className="flex-1 truncate">
            <p className="text-sm font-medium">PDF Document</p>
            <p className="text-xs text-muted-foreground truncate">{fileUrl.split('/').pop()}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium mb-1">
              Certification Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter certification name"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="issuer" className="block text-sm font-medium mb-1">
              Issuer *
            </Label>
            <Input
              id="issuer"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="Organization that issued the certification"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium mb-2">
              Certification File *
            </Label>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isUploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? "Uploading..." : "Upload File"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Upload an image (JPG, PNG, WebP) or PDF file
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading || isUploading}
              />
              
              {fileUrl && (
                <div className="relative">
                  {getFilePreview()}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-background border border-border hover:bg-destructive hover:text-destructive-foreground"
                    onClick={handleClearFile}
                    disabled={isLoading || isUploading}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what the certification validates"
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="date" className="block text-sm font-medium mb-1">
              Issue Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="credentialUrl" className="block text-sm font-medium mb-1">
              Credential URL (optional)
            </Label>
            <Input
              id="credentialUrl"
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              placeholder="Link to verify the credential"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <Button variant="outline" onClick={onCancel} disabled={isLoading || isUploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading || isUploading}
            >
              <Save className="mr-2 h-4 w-4" />
              {editingId ? "Update" : "Add"} Certification
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationEditor;
