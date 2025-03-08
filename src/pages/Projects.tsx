
import ProjectCard from "../components/ProjectCard";

const projectsData = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A full-featured e-commerce platform built with React and Node.js. Includes product catalog, shopping cart, user authentication, and payment processing with Stripe.",
    imageUrl: "",
    tags: ["React", "Node.js", "Express", "MongoDB", "Stripe"],
    liveUrl: "https://example.com/ecommerce",
    githubUrl: "https://github.com/example/ecommerce",
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application that helps teams organize and track their projects. Features include drag-and-drop task boards, deadlines, assignments, and real-time updates.",
    imageUrl: "",
    tags: ["React", "Firebase", "Tailwind CSS", "React DnD"],
    liveUrl: "https://example.com/taskmanager",
    githubUrl: "https://github.com/example/taskmanager",
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "A weather forecasting application that displays current weather conditions and 7-day forecasts for any location. Integrates with multiple weather APIs for accurate data.",
    imageUrl: "",
    tags: ["JavaScript", "API Integration", "Chart.js", "CSS"],
    liveUrl: "https://example.com/weather",
    githubUrl: "https://github.com/example/weather",
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "A responsive portfolio website built with React and Tailwind CSS. Features smooth animations, project showcase, and contact form.",
    imageUrl: "",
    tags: ["React", "Tailwind CSS", "Animation", "Responsive Design"],
    liveUrl: "https://example.com/portfolio",
    githubUrl: "https://github.com/example/portfolio",
  },
  {
    id: 5,
    title: "Recipe Finder",
    description: "A web application that helps users find recipes based on ingredients they have. Includes filtering options, nutritional information, and user reviews.",
    imageUrl: "",
    tags: ["React", "API Integration", "Responsive Design"],
    liveUrl: "https://example.com/recipes",
    githubUrl: "https://github.com/example/recipes",
  },
  {
    id: 6,
    title: "Fitness Tracker",
    description: "A mobile-first web application for tracking workouts and fitness progress. Features include exercise logging, progress charts, and goal setting.",
    imageUrl: "",
    tags: ["React", "Chart.js", "Firebase", "PWA"],
    liveUrl: "https://example.com/fitness",
    githubUrl: "https://github.com/example/fitness",
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col gap-6 mb-16 animate-fade-in">
            <span className="text-sm font-medium text-primary">My Work</span>
            <h1 className="text-4xl md:text-5xl font-bold">Projects & Portfolio</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              A showcase of my projects and applications I've built. Each project represents unique challenges and learning experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.map((project) => (
              <div key={project.id} className="animate-scale-in">
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  imageUrl={project.imageUrl}
                  tags={project.tags}
                  liveUrl={project.liveUrl}
                  githubUrl={project.githubUrl}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
