
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import AdminProjectCard from "../AdminProjectCard";
import { Project, getAllProjects, addProject, updateProject, deleteProject } from "../../utils/projectData";
import ProjectEditor from "./ProjectEditor";

const ProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const allProjects = await getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      toast({
        title: "Error Loading Projects",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingId(project.id);
    setIsEditing(true);
  };

  const handleSaveProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      if (editingId) {
        // Update existing project
        await updateProject({
          id: editingId,
          ...projectData
        });
        
        toast({
          title: "Success",
          description: "Project updated successfully!",
        });
      } else {
        // Create new project
        await addProject(projectData);
        
        toast({
          title: "Success",
          description: "New project created successfully!",
        });
      }

      // Reset form and reload projects
      resetProjectForm();
      loadProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: "Failed to save the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
      loadProjects();
      
      if (editingId === id) {
        resetProjectForm();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetProjectForm = () => {
    setEditingId(null);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <ProjectEditor 
          editingId={editingId}
          onSave={handleSaveProject}
          onCancel={resetProjectForm}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Projects</h2>
            <Button onClick={() => setIsEditing(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>

          {projects.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No projects found. Create your first project!</p>
          ) : (
            <div className="grid gap-6">
              {projects.map((project) => (
                <AdminProjectCard
                  key={project.id}
                  project={project}
                  onEdit={() => handleEditProject(project)}
                  onDelete={() => handleDeleteProject(project.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectManager;
