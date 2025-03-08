
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import { getAllProjects, Project } from "../utils/projectData";
import { isAuthenticated } from "../utils/authUtils";

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
                <Link 
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <PlusCircle size={16} />
                  Manage Projects
                </Link>
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
                  <Link 
                    to="/admin"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                  >
                    <PlusCircle size={18} />
                    Add Your First Project
                  </Link>
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
