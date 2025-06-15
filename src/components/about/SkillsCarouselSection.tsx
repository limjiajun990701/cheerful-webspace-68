
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

/**
 * Props for the SkillsCarouselSection reusable component
 */
export interface SkillsCarouselSectionProps {
  sectionTitle?: React.ReactNode;
  description?: string;
  skills: {
    category: string;
    iconUrl?: string;
    items: {
      name: string;
      iconUrl?: string;
    }[];
  }[];
  joinButton?: {
    label: string;
    onClick?: () => void;
  };
  learnButton?: {
    label: string;
    onClick?: () => void;
  };
  carouselInterval?: number;
  skillsBgClassName?: string;
}

const SkillsCarouselSection: React.FC<SkillsCarouselSectionProps> = ({
  sectionTitle = (
    <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
      <span className="text-primary drop-shadow font-sans">My</span>{" "}
      <span className="text-gray-100">Skills</span>
    </span>
  ),
  description = "Technologies, languages, and tools I have experience with.",
  skills,
  joinButton = { label: "JOIN US!", onClick: () => {} },
  learnButton = { label: "LEARN MORE", onClick: () => {} },
  carouselInterval = 3200,
  skillsBgClassName = "bg-gradient-to-br from-[#171A1F] via-[#21242B] to-[#2D293E]",
}) => {
  return (
    <section
      className={`${skillsBgClassName} relative py-16 md:py-24 w-full min-h-[420px] flex items-center justify-center`}
      aria-label="Skills Carousel Section"
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 20%, #6c63ff0a 70%, transparent 100%)",
        }}
      />
      <div className="relative z-10 max-w-5xl w-full mx-auto px-3 md:px-6 flex flex-col items-center">
        <h2 className="text-center mb-5">{sectionTitle}</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
          {description}
        </p>
        <div className="flex gap-6 mb-10 justify-center">
          {joinButton && (
            <Button
              className="bg-primary hover:bg-primary/80 text-white text-base font-semibold px-8 py-3 rounded-lg shadow-md transition-transform duration-150 hover:scale-105"
              style={{ boxShadow: "0 4px 20px 0 #6c63ff10" }}
              onClick={joinButton.onClick}
            >
              {joinButton.label}
            </Button>
          )}
          {learnButton && (
            <Button
              className="bg-secondary hover:bg-secondary/70 text-primary-foreground text-base font-semibold px-8 py-3 rounded-lg shadow-md transition-transform duration-150 hover:scale-105"
              onClick={learnButton.onClick}
            >
              {learnButton.label}
            </Button>
          )}
        </div>
        {/* Carousel */}
        <SkillsLogoCarousel
          skills={skills}
          interval={carouselInterval}
        />
      </div>
    </section>
  );
};

interface SkillsLogoCarouselProps {
  skills: SkillsCarouselSectionProps["skills"];
  interval?: number;
}

function SkillsLogoCarousel({ skills, interval = 2600 }: SkillsLogoCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);

  // Auto-scroll every [interval] ms
  React.useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      api.scrollNext();
    }, interval);
    return () => clearInterval(id);
  }, [api, interval]);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      setApi={setApi}
      className="w-full max-w-4xl mx-auto"
    >
      <CarouselContent>
        {skills.map((group, idx) => (
          <CarouselItem
            key={group.category}
            className="basis-1/2 md:basis-1/3 lg:basis-1/4 flex justify-center"
          >
            <div
              className="w-[210px] h-[150px] md:w-[220px] md:h-[170px] border border-cyan-400/40 rounded-xl bg-black/30 flex flex-col items-center justify-center group transition-transform hover:scale-105 hover:shadow-lg hover:border-cyan-400 duration-200"
              title={group.category}
            >
              <div className="font-semibold text-cyan-400 text-base mb-2">{group.category}</div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col items-center gap-1 group/icon"
                  >
                    {item.iconUrl ? (
                      <ImageWithFallback
                        src={item.iconUrl}
                        alt={item.name}
                        className="w-8 h-8 object-cover rounded hover:scale-110 transition-transform border border-cyan-400/60 bg-black/20"
                        showSkeleton
                        aspectRatio="square"
                      />
                    ) : (
                      <span className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground border border-border">
                        ?
                      </span>
                    )}
                    <span className="text-[12px] text-gray-200 text-center max-w-[58px] truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 md:-left-10 bg-black/60 border-cyan-400/50 text-cyan-200 hover:bg-cyan-700/80" />
      <CarouselNext className="right-0 md:-right-10 bg-black/60 border-cyan-400/50 text-cyan-200 hover:bg-cyan-700/80" />
    </Carousel>
  );
}

export default SkillsCarouselSection;
