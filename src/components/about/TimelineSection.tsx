
import React from 'react';

interface TimelineItem {
  id: string;
  type: 'work' | 'education';
  title: string;
  company: string;
  location: string;
  date: string;
  description: string;
}

interface TimelineSectionProps {
  items: TimelineItem[];
}

const TimelineSection = ({ items }: TimelineSectionProps) => {
  // Sort by date descending or as desired
  const work = items.filter((i) => i.type === 'work');
  const education = items.filter((i) => i.type === 'education');

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold mb-10 text-center">My Journey</h2>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Education - Left */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-primary">Education</h3>
          <div className="space-y-8">
            {education.map((item) => (
              <div key={item.id} className="relative border-l-4 border-primary/40 pl-6">
                <span className="absolute -left-3 top-3 w-4 h-4 bg-primary rounded-full border-2 border-background"></span>
                <div>
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <div className="text-muted-foreground text-sm mb-1">{item.company} &middot; {item.date}</div>
                  <div className="text-xs text-foreground/60 mb-2">{item.location}</div>
                  <p className="text-foreground/80 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Work Experience - Right */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-primary">Work Experience</h3>
          <div className="space-y-8">
            {work.map((item) => (
              <div key={item.id} className="relative border-r-4 border-primary/40 pr-6 text-right">
                <span className="absolute -right-3 top-3 w-4 h-4 bg-primary rounded-full border-2 border-background"></span>
                <div>
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <div className="text-muted-foreground text-sm mb-1">{item.company} &middot; {item.date}</div>
                  <div className="text-xs text-foreground/60 mb-2">{item.location}</div>
                  <p className="text-foreground/80 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Center line for timeline */}
        <div className="hidden md:block absolute top-4 bottom-0 left-1/2 w-1 bg-border z-0" style={{ transform: "translateX(-50%)" }} />
      </div>
    </section>
  );
};

export default TimelineSection;
