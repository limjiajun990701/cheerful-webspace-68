
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Project } from "../../utils/projectData";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { useToast } from "../../hooks/use-toast";

interface ProjectEditorProps {
  editingId: string | null;
  onSave: (project: Omit<Project, 'id'>) => void;
  onCancel: () => void;
}

const ProjectEditor = ({ editingId, onSave, onCancel }: ProjectEditorProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const { toast } = useToast();

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

    onSave({
      title,
      description,
      imageUrl: imageUrl || undefined,
      tags: tagArray,
      liveUrl: liveUrl || undefined,
      githubUrl: githubUrl || undefined
    });
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

          <div>
            <label htmlFor="projectImageUrl" className="block text-sm font-medium mb-1">
              Image URL (optional)
            </label>
            <Input
              id="projectImageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
            />
          </div>

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
              value={liveUrl}
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
              value={githubUrl}
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
