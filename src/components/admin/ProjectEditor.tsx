
import { useState, useEffect, ChangeEvent } from "react";
import { Save, Upload, FileText, Image as ImageIcon } from "lucide-react";
import { Project } from "../../types/database";
import { getProjectById } from "../../utils/projectData";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useToast } from "../../hooks/use-toast";
import BackgroundRemover from "../BackgroundRemover";

interface ProjectEditorProps {
  editingId: string | null;
  onSave: (project: Omit<Project, 'id'>) => void;
  onCancel: () => void;
}

const ProjectEditor = ({ editingId, onSave, onCancel }: ProjectEditorProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageurl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [filetype, setFileType] = useState<"image" | "pdf" | null>(null);
  const [tags, setTags] = useState("");
  const [liveurl, setLiveUrl] = useState("");
  const [githuburl, setGithubUrl] = useState("");
  const [backgroundRemoved, setBackgroundRemoved] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (editingId) {
      loadProject(editingId);
    } else {
      resetForm();
    }
  }, [editingId]);

  const loadProject = async (id: string) => {
    try {
      const project = await getProjectById(id);
      if (project) {
        setTitle(project.title);
        setDescription(project.description);
        setImageUrl(project.imageurl || "");
        setTags(project.tags.join(", "));
        setLiveUrl(project.liveurl || "");
        setGithubUrl(project.githuburl || "");
        
        if (project.fileurl) {
          setFilePreview(project.fileurl);
          setFileType(project.filetype || null);
        }
      }
    } catch (error) {
      console.error("Error loading project:", error);
      toast({
        title: "Error",
        description: "Failed to load project details.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setFile(null);
    setFilePreview(null);
    setFileType(null);
    setTags("");
    setLiveUrl("");
    setGithubUrl("");
    setBackgroundRemoved(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const isImage = selectedFile.type.startsWith('image/');
    const isPdf = selectedFile.type === 'application/pdf';

    if (!isImage && !isPdf) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image (JPG, PNG, WebP) or a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setFileType(isImage ? "image" : "pdf");
    setBackgroundRemoved(null); // Reset background removed state

    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleProcessedImage = (processedImageUrl: string) => {
    setBackgroundRemoved(processedImageUrl);
  };

  const handleSave = () => {
    if (!title || !description) {
      toast({
        title: "Missing Fields",
        description: "Title and description are required.",
        variant: "destructive",
      });
      return;
    }

    const tagArray = tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag !== "");

    // Use background removed image if available
    const finalFileUrl = backgroundRemoved || filePreview;
    
    if (file && !backgroundRemoved) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileurl = reader.result as string;
        
        onSave({
          title,
          description,
          imageurl: imageurl || undefined,
          fileurl,
          filetype,
          tags: tagArray,
          liveurl: liveurl || undefined,
          githuburl: githuburl || undefined,
          date: new Date().toISOString()
        });
      };
      reader.readAsDataURL(file);
    } else {
      onSave({
        title,
        description,
        imageurl: imageurl || undefined,
        fileurl: finalFileUrl || undefined,
        filetype: filetype || undefined,
        tags: tagArray,
        liveurl: liveurl || undefined,
        githuburl: githuburl || undefined,
        date: new Date().toISOString()
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="projectTitle" className="block text-sm font-medium mb-1">
              Project Title *
            </label>
            <Input
              id="projectTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label htmlFor="projectDescription" className="block text-sm font-medium mb-1">
              Description *
            </label>
            <Textarea
              id="projectDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your project description"
              className="min-h-[150px]"
            />
          </div>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="remove-bg">Remove Background</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div>
                <label htmlFor="projectFile" className="block text-sm font-medium mb-1">
                  Project File (PDF or Image)
                </label>
                <div className="flex flex-col space-y-2">
                  <Input
                    id="projectFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  
                  {filePreview && filetype === "image" ? (
                    <div className="mt-2 w-full max-w-xs h-32 border rounded-md overflow-hidden">
                      <img 
                        src={backgroundRemoved || filePreview} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : filetype === "pdf" ? (
                    <div className="mt-2 flex items-center space-x-2 p-2 border rounded-md max-w-xs">
                      <FileText className="text-primary" size={20} />
                      <span className="text-sm">PDF Document</span>
                    </div>
                  ) : null}
                </div>
                
                <p className="text-xs text-muted-foreground mt-1">
                  Supported formats: JPG, PNG, WebP, PDF
                </p>
              </div>

              <div>
                <label htmlFor="projectImageUrl" className="block text-sm font-medium mb-1">
                  Image URL (optional, fallback if no file uploaded)
                </label>
                <Input
                  id="projectImageUrl"
                  value={imageurl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>
            </TabsContent>

            <TabsContent value="remove-bg" className="space-y-4">
              {filetype === "image" && filePreview ? (
                <BackgroundRemover onProcessedImage={handleProcessedImage} />
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Image Selected</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please upload an image file first in the "Upload File" tab
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div>
            <label htmlFor="projectTags" className="block text-sm font-medium mb-1">
              Tags (comma separated)
            </label>
            <Input
              id="projectTags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. React, TypeScript, UI/UX"
            />
          </div>

          <div>
            <label htmlFor="projectLiveUrl" className="block text-sm font-medium mb-1">
              Live Demo URL (optional)
            </label>
            <Input
              id="projectLiveUrl"
              value={liveurl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label htmlFor="projectGithubUrl" className="block text-sm font-medium mb-1">
              GitHub URL (optional)
            </label>
            <Input
              id="projectGithubUrl"
              value={githuburl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="flex gap-4 justify-end pt-4">
            {editingId && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              {editingId ? "Update" : "Create"} Project
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectEditor;
