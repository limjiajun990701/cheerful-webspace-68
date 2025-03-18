export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  slug?: string;
  content?: string;
  date?: string;
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

// Mock projects
export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Linksay Social Chat App Enhancements",
    description: "Led feature development for a social chat application, implementing album selection, image editing capabilities, and multimedia sharing. Integrated support for sending, saving, and forwarding edited images. Designed UI for 'red envelope' feature with Web3 wallet integration.",
    imageUrl: "/placeholder.svg",
    tags: ["Flutter", "Mobile Development", "UI/UX", "Web3"],
    liveUrl: "",
    githubUrl: "https://github.com/LIMJIAJUN",
    slug: "linksay-social-chat-app",
    content: "",
    date: "2024-07-01"
  },
  {
    id: "2",
    title: "Fullstack Hostel Report System",
    description: "Developed a comprehensive hostel management system with a responsive frontend built with Vue.js and TypeScript. Created a robust backend using Quarkus framework with REST APIs and MariaDB for data management. Implemented efficient reporting and data visualization features.",
    imageUrl: "/placeholder.svg",
    tags: ["Vue.js", "TypeScript", "Quarkus", "MariaDB", "REST API"],
    liveUrl: "",
    githubUrl: "https://github.com/LIMJIAJUN",
    slug: "fullstack-hostel-report-system",
    content: "",
    date: "2024-01-15"
  },
  {
    id: "3",
    title: "Microservices API Development",
    description: "Designed and implemented microservices architecture to ensure consistent data handling across applications. Optimized API response performance and addressed data type inconsistencies. Improved system reliability through standardized error handling and validation.",
    imageUrl: "/placeholder.svg",
    tags: ["Microservices", "API Development", "Java", "REST"],
    liveUrl: "",
    githubUrl: "https://github.com/LIMJIAJUN",
    slug: "microservices-api-development",
    content: "",
    date: "2023-11-10"
  },
  {
    id: "4",
    title: "PHPJasper Report Development",
    description: "Enhanced reporting system by improving JRXML report templates and integrating optimized SQL queries. Streamlined data retrieval processes and improved reporting efficiency, resulting in faster generation of complex reports.",
    imageUrl: "/placeholder.svg",
    tags: ["PHP", "PHPJasper", "SQL", "Report Generation"],
    liveUrl: "",
    githubUrl: "https://github.com/LIMJIAJUN",
    slug: "phpjasper-report-development",
    content: "",
    date: "2024-02-20"
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
