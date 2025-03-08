
import ExperienceCard from "../components/ExperienceCard";

const experienceData = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    date: "2020 - Present",
    description: 
      "Lead the frontend development team in building responsive web applications using React and TypeScript. Implemented state management with Redux, created reusable component libraries, and optimized application performance. Collaborated with UX/UI designers to transform mockups into functional interfaces.",
    type: "work" as const,
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "Digital Solutions LLC",
    location: "Boston, MA",
    date: "2018 - 2020",
    description: 
      "Developed and maintained client websites and web applications using JavaScript, HTML, and CSS. Collaborated with the design team to implement responsive UI components and ensure cross-browser compatibility. Implemented analytics tracking and SEO optimizations.",
    type: "work" as const,
  },
  {
    id: 3,
    title: "Web Development Intern",
    company: "StartUp Hub",
    location: "Chicago, IL",
    date: "2017 - 2018",
    description: 
      "Assisted in developing website features and fixing bugs for various client projects. Gained hands-on experience with JavaScript frameworks and responsive design techniques. Participated in code reviews and agile development processes.",
    type: "work" as const,
  },
  {
    id: 4,
    title: "Master of Computer Science",
    company: "Tech University",
    location: "Boston, MA",
    date: "2015 - 2017",
    description: 
      "Specialized in web technologies and user interface design. Completed thesis on optimizing JavaScript performance in single-page applications. Participated in various hackathons and coding competitions.",
    type: "education" as const,
  },
  {
    id: 5,
    title: "Bachelor of Science in Computer Science",
    company: "State University",
    location: "Chicago, IL",
    date: "2011 - 2015",
    description: 
      "Completed coursework in programming fundamentals, algorithms, data structures, and web development. Participated in student-led software development projects and coding clubs.",
    type: "education" as const,
  },
];

const Experience = () => {
  // Separate work and education experiences
  const workExperience = experienceData.filter(exp => exp.type === "work");
  const education = experienceData.filter(exp => exp.type === "education");

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-6 mb-16 animate-fade-in">
            <span className="text-sm font-medium text-primary">My Journey</span>
            <h1 className="text-4xl md:text-5xl font-bold">Experience & Education</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              A chronological overview of my professional experience and educational background.
            </p>
          </div>
          
          <div className="space-y-16">
            <section>
              <h2 className="text-2xl font-bold mb-10 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <BriefcaseIcon className="w-4 h-4 text-primary" />
                </span>
                Professional Experience
              </h2>
              
              <div className="ml-4">
                {workExperience.map((experience) => (
                  <ExperienceCard
                    key={experience.id}
                    title={experience.title}
                    company={experience.company}
                    location={experience.location}
                    date={experience.date}
                    description={experience.description}
                    type={experience.type}
                  />
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-10 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </span>
                Education
              </h2>
              
              <div className="ml-4">
                {education.map((experience) => (
                  <ExperienceCard
                    key={experience.id}
                    title={experience.title}
                    company={experience.company}
                    location={experience.location}
                    date={experience.date}
                    description={experience.description}
                    type={experience.type}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
