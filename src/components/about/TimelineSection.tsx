
import React from 'react';
import { TimelineItem } from '@/types/TimelineItem';

interface TimelineSectionProps {
  items: TimelineItem[];
}

// Helper to alternate left/right
const isEven = (index: number) => index % 2 === 0;

const TimelineSection = ({ items }: TimelineSectionProps) => {
  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold mb-10 text-center">My Journey</h2>
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute top-0 left-1/2 w-1 h-full bg-border z-0" style={{ transform: "translateX(-50%)" }} />
        <div className="relative flex flex-col gap-12">
          {items.length === 0 && (
            <div className="text-center text-muted-foreground py-8">No work experiences found.</div>
          )}
          {items.map((item, idx) => {
            const left = isEven(idx);
            return (
              <div key={item.id} className="relative flex items-center justify-between group">
                <div className={`w-full md:w-1/2 px-6 ${left ? "order-1 text-left" : "order-3 text-right"}`}>
                  <div className="bg-card shadow-md rounded-lg p-6 border border-primary/10 relative z-10">
                    <div className="font-semibold text-lg">{item.title}</div>
                    <div className="text-primary text-sm mb-1">{item.company}{item.date && ` · ${item.date}`}</div>
                    {item.location && <div className="text-xs mb-2 text-foreground/60">{item.location}</div>}
                    <p className="text-foreground/80 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <span className="w-5 h-5 bg-primary border-4 border-background rounded-full block" />
                </div>
                {/* Spacer for timeline alignment */}
                <div className={`hidden md:block w-1/2 ${left ? "order-3" : "order-1"}`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
