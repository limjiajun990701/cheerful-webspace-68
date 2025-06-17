
import React, { useEffect, useRef } from 'react';
import * as anime from 'animejs';
import { TimelineItem } from '@/types/TimelineItem';
import { useAnimeScrollReveal } from '@/hooks/useAnimeScrollReveal';

interface AnimeTimelineSectionProps {
  items: TimelineItem[];
  sectionTitle?: string;
}

const isEven = (index: number) => index % 2 === 0;

const AnimeTimelineSection = ({ items, sectionTitle = "My Journey" }: AnimeTimelineSectionProps) => {
  const titleReveal = useAnimeScrollReveal({ 
    threshold: 0.5, 
    triggerOnce: true, 
    animationType: 'slide-up',
    duration: 1000
  });
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const setItemRef = (id: string) => (element: HTMLDivElement | null) => {
    if (element) {
      itemRefs.current.set(id, element);
    } else {
      itemRefs.current.delete(id);
    }
  };

  useEffect(() => {
    const itemElements = Array.from(itemRefs.current.values());
    if (itemElements.length === 0) return;

    // Set initial states for all items
    anime.set(itemElements, {
      opacity: 0,
      translateY: 50,
      scale: 0.9
    });

    // Set up intersection observers for each item
    const observers: IntersectionObserver[] = [];

    items.forEach((item, index) => {
      const element = itemRefs.current.get(item.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const isLeft = isEven(index);
            
            // Animate the timeline dot first
            const dot = element.querySelector('.timeline-dot');
            if (dot) {
              anime({
                targets: dot,
                scale: [0, 1.2, 1],
                opacity: [0, 1],
                duration: 600,
                easing: 'easeOutElastic(1, 0.8)'
              });
            }

            // Then animate the card with a slight delay
            anime({
              targets: element.querySelector('.timeline-card'),
              opacity: [0, 1],
              translateY: [50, 0],
              translateX: isLeft ? [-30, 0] : [30, 0],
              scale: [0.9, 1],
              duration: 800,
              delay: 200,
              easing: 'easeOutQuart'
            });

            observer.unobserve(element);
          }
        },
        {
          threshold: 0.3,
          rootMargin: '0px 0px -100px 0px'
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    // Reset animations on page change
    const handleReset = () => {
      anime.set(itemElements, {
        opacity: 0,
        translateY: 50,
        translateX: 0,
        scale: 0.9
      });
    };

    window.addEventListener('resetScrollAnimations', handleReset);

    return () => {
      observers.forEach(observer => observer.disconnect());
      window.removeEventListener('resetScrollAnimations', handleReset);
    };
  }, [items]);

  return (
    <section className="py-20" ref={timelineRef}>
      <div ref={titleReveal.ref}>
        <h2 className="text-3xl font-bold mb-10 text-center">
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
            
            return (
              <div key={item.id} ref={setItemRef(item.id)} className="relative flex items-center justify-between group">
                <div className={`w-full md:w-1/2 px-6 ${left ? "order-1 text-left" : "order-3 text-right"}`}>
                  <div className="timeline-card bg-card shadow-md rounded-lg p-6 border border-primary/10 relative z-10 hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="font-semibold text-lg">{item.title}</div>
                    <div className="text-primary text-sm mb-1">
                      {item.company}{item.date && ` · ${item.date}`}
                    </div>
                    {item.location && (
                      <div className="text-xs mb-2 text-foreground/60">
                        {item.location}
                      </div>
                    )}
                    <p className="text-foreground/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <div className="timeline-dot absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <span className="w-5 h-5 bg-primary border-4 border-background rounded-full block" />
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

export default AnimeTimelineSection;
