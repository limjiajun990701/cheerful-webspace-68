
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
}

// Initial sample projects
const initialProjects: Project[] = [
  {
    id: "1",
    title: "Personal Portfolio Website",
    description: "A responsive personal portfolio website built with React and Tailwind CSS. Features dark mode, responsive design, and animations.",
    imageUrl: "",
    tags: ["React", "Tailwind CSS", "TypeScript"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/portfolio"
  },
  {
    id: "2",
    title: "E-commerce Dashboard",
    description: "An admin dashboard for e-commerce platforms with analytics, inventory management, and order processing capabilities.",
    imageUrl: "",
    tags: ["React", "Chart.js", "Material UI"],
    liveUrl: "https://example-dashboard.com",
    githubUrl: "https://github.com/example/dashboard"
  }
];

// Function to get all projects
export const getAllProjects = (): Promise<Project[]> => {
  // Get projects from localStorage or use initial data
  const storedProjects = localStorage.getItem('projects');
  const projects = storedProjects ? JSON.parse(storedProjects) : initialProjects;
  
  return Promise.resolve(projects);
};

// Function to get a single project by ID
export const getProjectById = (id: string): Promise<Project | undefined> => {
  const storedProjects = localStorage.getItem('projects');
  const projects = storedProjects ? JSON.parse(storedProjects) : initialProjects;
  
  const project = projects.find((project: Project) => project.id === id);
  return Promise.resolve(project);
};

// Function to add a new project
export const addProject = (project: Omit<Project, 'id'>): Promise<Project> => {
  const storedProjects = localStorage.getItem('projects');
  const projects = storedProjects ? JSON.parse(storedProjects) : initialProjects;
  
  // Generate a new ID
  const newId = (Math.max(...projects.map((p: Project) => parseInt(p.id)), 0) + 1).toString();
  
  const newProject = {
    ...project,
    id: newId
  };
  
  const updatedProjects = [...projects, newProject];
  localStorage.setItem('projects', JSON.stringify(updatedProjects));
  
  return Promise.resolve(newProject);
};

// Function to update an existing project
export const updateProject = (project: Project): Promise<Project> => {
  const storedProjects = localStorage.getItem('projects');
  const projects = storedProjects ? JSON.parse(storedProjects) : initialProjects;
  
  const updatedProjects = projects.map((p: Project) => 
    p.id === project.id ? project : p
  );
  
  localStorage.setItem('projects', JSON.stringify(updatedProjects));
  
  return Promise.resolve(project);
};

// Function to delete a project
export const deleteProject = (id: string): Promise<void> => {
  const storedProjects = localStorage.getItem('projects');
  const projects = storedProjects ? JSON.parse(storedProjects) : initialProjects;
  
  const updatedProjects = projects.filter((p: Project) => p.id !== id);
  localStorage.setItem('projects', JSON.stringify(updatedProjects));
  
  return Promise.resolve();
};
