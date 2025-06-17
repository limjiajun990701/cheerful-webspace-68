
import React, { useEffect, useRef, useState } from 'react';
import { TimelineItem } from '@/types/TimelineItem';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface TimelineSectionProps {
  items: TimelineItem[];
  sectionTitle?: string;
}

// Helper to alternate left/right
const isEven = (index: number) => index % 2 === 0;

const TimelineSection = ({ items, sectionTitle = "My Journey" }: TimelineSectionProps) => {
  const titleReveal = useScrollReveal({ threshold: 0.5, triggerOnce: true });
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Set up intersection observer for individual items
  useEffect(() => {
    const observers = new Map<string, IntersectionObserver>();

    items.forEach((item) => {
      const element = itemRefs.current.get(item.id);
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleItems(prev => new Set([...prev, item.id]));
              observer.unobserve(element);
            }
          },
          {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
          }
        );
        observer.observe(element);
        observers.set(item.id, observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [items]);

  const setItemRef = (id: string) => (element: HTMLDivElement | null) => {
    if (element) {
      itemRefs.current.set(id, element);
    } else {
      itemRefs.current.delete(id);
    }
  };

  return (
    <section className="py-20">
      <div ref={titleReveal.ref}>
        <h2 className={`text-3xl font-bold mb-10 text-center transition-all duration-800 ${
          titleReveal.isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
        }`}>
          {sectionTitle}
        </h2>
      </div>
      
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute top-0 left-1/2 w-1 h-full bg-border z-0" style={{ transform: "translateX(-50%)" }} />
        <div className="relative flex flex-col gap-12">
          {items.length === 0 && (
            <div className="text-center text-muted-foreground py-8">No experiences found.</div>
          )}
          {items.map((item, idx) => {
            const left = isEven(idx);
            const isVisible = visibleItems.has(item.id);
            
            return (
              <div key={item.id} ref={setItemRef(item.id)} className="relative flex items-center justify-between group">
                <div className={`w-full md:w-1/2 px-6 ${left ? "order-1 text-left" : "order-3 text-right"}`}>
                  <div className={`bg-card shadow-md rounded-lg p-6 border border-primary/10 relative z-10 transform transition-all duration-800 hover:shadow-xl hover:scale-105 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0 translate-x-0' 
                      : `opacity-0 translate-y-8 ${left ? '-translate-x-8' : 'translate-x-8'}`
                  }`} style={{ transitionDelay: `${idx * 0.2}s` }}>
                    <div className="font-semibold text-lg animate-slide-up">{item.title}</div>
                    <div className="text-primary text-sm mb-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                      {item.company}{item.date && ` · ${item.date}`}
                    </div>
                    {item.location && (
                      <div className="text-xs mb-2 text-foreground/60 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        {item.location}
                      </div>
                    )}
                    <p className="text-foreground/80 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transform transition-all duration-500 ${
                  isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`} style={{ transitionDelay: `${idx * 0.2 + 0.3}s` }}>
                  <span className="w-5 h-5 bg-primary border-4 border-background rounded-full block animate-bounce-in" />
                </div>
                
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
