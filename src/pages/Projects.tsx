
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import { getAllProjects, Project } from "../utils/projectData";
import { isAuthenticated } from "../utils/authUtils";
import { Button } from "@/components/ui/button";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = isAuthenticated();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getAllProjects();
        setProjects(allProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col gap-6 mb-16 animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm font-medium text-primary">My Portfolio</span>
                <h1 className="text-4xl md:text-5xl font-bold mt-2">Projects</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mt-4">
                  A showcase of my work and personal projects.
                </p>
              </div>
              
              {isAdmin && (
                <Button asChild size="sm">
                  <Link to="/admin">
                    <PlusCircle className="mr-1.5" size={16} />
                    Manage Projects
                  </Link>
                </Button>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">Loading projects...</div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground">
                Check back later for updates on my latest work.
              </p>
              
              {isAdmin && (
                <div className="mt-8">
                  <Button asChild>
                    <Link to="/admin">
                      <PlusCircle className="mr-1.5" size={18} />
                      Add Your First Project
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="animate-scale-in">
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    imageUrl={project.imageUrl || ""}
                    tags={project.tags}
                    liveUrl={project.liveUrl}
                    githubUrl={project.githubUrl}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
