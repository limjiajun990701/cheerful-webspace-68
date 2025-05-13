
import React, { useState } from 'react';
import { BriefcaseIcon, GraduationCap, Building, Calendar, ChevronDown, ChevronUp, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import SkillTag from "./SkillTag";
import TimelineIndicator from "./experience/TimelineIndicator";

interface Achievement {
  title: string;
  value: string;
}

interface ExperienceCardProps {
  title: string;
  company: string;
  location: string;
  date: string;
  description: string;
  type: "work" | "education";
  skills?: string[];
  achievements?: Achievement[];
  durationInMonths?: number;
}

const ExperienceCard = ({ 
  title, 
  company, 
  location, 
  date, 
  description, 
  type,
  skills = [],
  achievements = [],
  durationInMonths = 0
}: ExperienceCardProps) => {
  const [expanded, setExpanded] = useState(false);

  // Parse the description to get summary and details
  const getSummary = (desc: string) => {
    if (desc.length <= 150) return desc;
    return desc.substring(0, 150).trim() + '...';
  };
  
  return (
    <div className="relative pl-8 pb-12 group">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-px h-full bg-border group-last:h-8" />
      
      {/* Timeline dot with animation */}
      <div 
        className={cn(
          "absolute left-0 top-0 w-6 h-6 -translate-x-1/2 rounded-full border-4 border-background transition-all duration-300",
          "hover:scale-125 hover:border-primary/70",
          expanded ? "bg-primary scale-110" : "bg-primary"
        )}
      />
      
      <div 
        className={cn(
          "bg-background rounded-xl p-6 shadow-sm border border-border transition-all duration-300",
          "hover:shadow-md",
          expanded ? "ring-1 ring-primary/20" : ""
        )}
      >
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
        
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {type === "work" ? (
              <BriefcaseIcon className="w-5 h-5 text-primary" />
            ) : (
              <GraduationCap className="w-5 h-5 text-primary" />
            )}
            <h3 className="text-xl font-semibold">{title}</h3>
          </div>
          
          {/* Toggle button */}
          {description.length > 150 && (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-full hover:bg-secondary"
            >
              {expanded ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          )}
        </div>
        
        <p className="text-lg text-foreground/90 font-medium mb-4">{company}</p>
        
        {/* Duration indicator */}
        {durationInMonths > 0 && (
          <TimelineIndicator 
            durationInMonths={durationInMonths} 
            className="mb-4"
          />
        )}
        
        {/* Description with expand/collapse */}
        <div className={cn(
          "transition-all duration-300 overflow-hidden",
          expanded ? "max-h-[1000px]" : "max-h-[150px]"
        )}>
          <p className="text-muted-foreground">
            {expanded ? description : getSummary(description)}
          </p>
        </div>
        
        {/* Achievements section */}
        {achievements.length > 0 && (
          <div className={cn(
            "mt-4 pt-4 border-t border-border",
            !expanded && achievements.length > 0 ? "hidden" : "block"
          )}>
            <h4 className="text-sm font-medium flex items-center gap-1 mb-2 text-muted-foreground">
              <Trophy size={14} />
              Key Achievements
            </h4>
            <ul className="space-y-1">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span>{achievement.title}</span>
                  <span className="font-semibold text-primary">{achievement.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Skills tags */}
        {skills.length > 0 && (
          <div className={cn(
            "mt-4 pt-4 border-t border-border flex flex-wrap",
            !expanded && skills.length > 0 ? "hidden" : "block"
          )}>
            {skills.map((skill, index) => (
              <SkillTag key={index} tag={skill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceCard;
