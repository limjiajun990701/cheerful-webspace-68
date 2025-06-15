
import React, { useEffect, useState } from "react";
import { getSkillGroups } from "@/utils/contentUtils";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";

/**
 * Show each skill group as a horizontal carousel row.
 */

interface SkillItem {
  name: string;
  iconUrl?: string;
}
interface SkillGroup {
  id: string;
  category: string;
  items: SkillItem[];
}

const SkillsRowsSection: React.FC = () => {
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getSkillGroups();
      setSkillGroups(data || []);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return <div className="py-20 text-center">Loading skills...</div>;
  }

  return (
    <section
      className="relative py-16 md:py-24 w-full min-h-[520px] flex items-center justify-center
        bg-gradient-to-br from-[#13161C] via-[#191B23] to-[#27243a] overflow-hidden"
      aria-label="Technologies/Skills Section"
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 16%, #2fff6f22 68%, transparent 100%)"
        }}
      />
      <div className="relative z-10 max-w-5xl w-full mx-auto px-3 sm:px-6 flex flex-col items-center">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center tracking-tight mb-5 font-sans">
          <span className="text-[#2FFF6F] drop-shadow-lg">Technologies</span>{" "}
          <span className="text-gray-100">We Use</span>
        </h2>
        <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
          We are still learning more knowledge, welcome to join us and make progress together with us
        </p>
        {/* CTA Buttons */}
        <div className="flex gap-5 mb-12 justify-center w-full flex-wrap">
          <Button
            className="bg-[#21C764] hover:bg-[#14b85e] text-white text-base font-semibold px-8 py-3 rounded-lg shadow-md transition-transform duration-150 hover:scale-105"
            style={{ boxShadow: "0 4px 20px 0 #2fff6f10" }}
          >
            JOIN US!
          </Button>
          <Button
            className="bg-[#433583] hover:bg-[#5E48BF] text-white text-base font-semibold px-8 py-3 rounded-lg shadow-md transition-transform duration-150 hover:scale-105"
          >
            LEARN MORE
          </Button>
        </div>
        {/* Skill group carousels, one row per group */}
        <div className="space-y-10 w-full">
          {skillGroups.map((group, idx) => (
            <div key={group.id || group.category}>
              <div className="mb-2 text-left sm:text-center pl-2 text-cyan-300 font-semibold text-lg">
                {group.category}
              </div>
              <SkillGroupCarousel skills={group.items} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface SkillGroupCarouselProps {
  skills: SkillItem[];
}

function SkillGroupCarousel({ skills }: SkillGroupCarouselProps) {
  // This renders a horizontal scroll-row (carousel) for each group
  const [api, setApi] = React.useState<CarouselApi | null>(null);

  // Optionally, auto scroll if more than 6 skills
  useEffect(() => {
    if (!api || skills.length <= 6) return;
    const id = setInterval(() => {
      api.scrollNext();
    }, 2400);
    return () => clearInterval(id);
  }, [api, skills.length]);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: skills.length > 6,
      }}
      setApi={setApi}
      className="w-full max-w-4xl mx-auto"
    >
      <CarouselContent>
        {skills.map((item) => (
          <CarouselItem
            key={item.name}
            className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 flex justify-center"
          >
            <div
              className="w-24 h-20 md:w-28 md:h-24 border border-cyan-400/50 rounded-xl bg-black/25 flex flex-col items-center justify-center
                transition-transform duration-200 hover:scale-110 hover:shadow-[0_0_20px_2px_#2fff6faa] hover:border-cyan-400"
              title={item.name}
            >
              {item.iconUrl ? (
                <ImageWithFallback
                  src={item.iconUrl}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded bg-muted border border-cyan-400/80 mb-1"
                  showSkeleton
                  aspectRatio="square"
                />
              ) : (
                <span className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground border border-border mb-1">
                  ?
                </span>
              )}
              <span className="text-xs text-gray-200 text-center max-w-[80px] truncate">{item.name}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {skills.length > 5 && (
        <>
          <CarouselPrevious className="left-0 md:-left-10 bg-black/60 border-cyan-400/50 text-cyan-200 hover:bg-cyan-700/80" />
          <CarouselNext className="right-0 md:-right-10 bg-black/60 border-cyan-400/50 text-cyan-200 hover:bg-cyan-700/80" />
        </>
      )}
    </Carousel>
  );
}

export default SkillsRowsSection;

