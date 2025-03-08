
import { BriefcaseIcon, GraduationCap, Building, Calendar } from "lucide-react";

interface ExperienceCardProps {
  title: string;
  company: string;
  location: string;
  date: string;
  description: string;
  type: "work" | "education";
}

const ExperienceCard = ({ 
  title, 
  company, 
  location, 
  date, 
  description, 
  type 
}: ExperienceCardProps) => {
  return (
    <div className="relative pl-8 pb-12 group">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-px h-full bg-border group-last:h-8" />
      
      {/* Timeline dot */}
      <div className="absolute left-0 top-0 w-6 h-6 -translate-x-1/2 rounded-full border-4 border-background bg-primary" />
      
      <div className="bg-background rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all">
        <div className="flex flex-wrap items-center gap-1 text-muted-foreground text-sm mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>{date}</span>
          </div>
          
          <span className="mx-2">•</span>
          
          <div className="flex items-center gap-1.5">
            <Building size={14} />
            <span>{location}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          {type === "work" ? (
            <BriefcaseIcon className="w-5 h-5 text-primary" />
          ) : (
            <GraduationCap className="w-5 h-5 text-primary" />
          )}
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        
        <p className="text-lg text-foreground/90 font-medium mb-4">{company}</p>
        
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default ExperienceCard;
