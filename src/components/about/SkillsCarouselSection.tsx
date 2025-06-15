
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

/**
 * Props for the SkillsCarouselSection reusable component
 */
export interface SkillsCarouselSectionProps {
  sectionTitle?: React.ReactNode;
  description?: string;
  skills: {
    category: string;
    iconUrl?: string; // Could be used in the future for a SVG, or keep null
    items: string[];
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
      <span className="text-primary drop-shadow font-sans">
        My
      </span>{" "}
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
  // Flatten skill items for logo carousel (category as label, with sub-skills as overlay/tooltip if wanted)
  const logos = skills.map((group) => ({
    name: group.category,
    // show first skill as img alt, no SVG for now
    details: group.items.join(", "),
    // iconUrl: group.iconUrl, // for future use if SVG or image available
  }));

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
  skills: {
    category: string;
    iconUrl?: string;
    items: string[];
  }[];
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
              className="w-[210px] h-[140px] md:w-[220px] md:h-[150px] border border-primary/30 rounded-2xl bg-black/30 flex flex-col items-center justify-center group transition-transform hover:scale-105 hover:shadow-lg hover:border-primary/70 duration-150"
              title={group.category}
            >
              <div className="font-semibold text-primary text-base mb-2">{group.category}</div>
              <div className="flex flex-wrap gap-2 justify-center items-center">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="bg-secondary text-sm font-medium text-secondary-foreground px-2.5 py-1 rounded shadow transition-colors hover:bg-secondary/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 md:-left-10 bg-black/60 border-primary/50 text-primary hover:bg-primary/70" />
      <CarouselNext className="right-0 md:-right-10 bg-black/60 border-primary/50 text-primary hover:bg-primary/70" />
    </Carousel>
  );
}

export default SkillsCarouselSection;
