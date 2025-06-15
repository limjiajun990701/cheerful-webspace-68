
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
import { Html5, React as ReactIcon, Vuejs, Nodejs, Docker, Git, Aws } from "lucide-react";

// ——— Placeholder SVG Components For techs: ———
const SVG_Python = (
  <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none"><rect width="48" height="48" rx="10" fill="#FFD845"/><path d="M32.724 15.306c-3.217-1.238-9.225-1.303-12.098.03-2.782 1.293-2.025 4.003-2.025 4.003h9.835v2.516h-13.15s-5.324-.656-5.324 5.519c0 6.174 6.014 5.862 6.014 5.862h3.464v-3.44s.125-2.674 4.552-2.674h8.5c4.426 0 4.485 2.472 4.485 2.472v8.039h2.01c1.313 0 2.38-.762 2.38-2.193V21.057c0-1.953-1.25-3.249-2.443-3.7ZM18.48 13.815a1.653 1.653 0 1 1 .009-3.306 1.653 1.653 0 0 1-.01 3.306Zm2.982 21.307c3.217 1.238 9.225 1.303 12.098-.03 2.782-1.293 2.025-4.003 2.025-4.003h-9.835v-2.516h13.15s5.324.656 5.324-5.519c0-6.174-6.014-5.862-6.014-5.862h-3.464v3.44s-.125 2.674-4.552 2.674h-8.5c-4.426 0-4.485-2.472-4.485-2.472v-8.039h-2.01c-1.313 0-2.38.762-2.38 2.193v9.222c0 1.953 1.25 3.248 2.443 3.7Zm14.405 1.491a1.653 1.653 0 1 0-.01 3.306 1.653 1.653 0 0 0 .01-3.306Z" fill="#356A99"/></svg>
);
const SVG_PHP = (
  <svg viewBox="0 0 48 48" className="w-10 h-10"><ellipse cx="24" cy="24" rx="22" ry="13" fill="#7377AD"/><text x="24" y="29" fontSize="14" fill="#fff" fontWeight="bold" textAnchor="middle" fontFamily="Inter,Arial,sans-serif">PHP</text></svg>
);
const SVG_SpringBoot = (
  <svg viewBox="0 0 48 48" className="w-10 h-10"><circle cx="24" cy="24" r="22" fill="#6CB52D"/><text x="24" y="30" fontSize="11" fill="#fff" fontWeight="bold" textAnchor="middle" fontFamily="Inter,Arial,sans-serif">Spring</text></svg>
);
const SVG_Laravel = (
  <svg viewBox="0 0 48 48" className="w-10 h-10"><rect width="48" height="48" rx="9" fill="#FB503B"/><text x="24" y="29" fontSize="14" fill="#fff" fontWeight="bold" textAnchor="middle" fontFamily="Inter,Arial,sans-serif">Laravel</text></svg>
);
const SVG_MySQL = (
  <svg viewBox="0 0 48 48" className="w-10 h-10"><ellipse cx="24" cy="24" rx="22" ry="12" fill="#005E87"/><text x="24" y="29" fontSize="13" fill="#fff" fontWeight="bold" textAnchor="middle" fontFamily="Inter,Arial,sans-serif">MySQL</text></svg>
);
const SVG_PostgreSQL = (
  <svg viewBox="0 0 48 48" className="w-10 h-10"><ellipse cx="24" cy="24" rx="22" ry="12" fill="#336791"/><text x="24" y="29" fontSize="12" fill="#fff" fontWeight="bold" textAnchor="middle" fontFamily="Inter,Arial,sans-serif">Postgre</text></svg>
);
const SVG_MariaDB = (
  <svg viewBox="0 0 48 48" className="w-10 h-10"><ellipse cx="24" cy="24" rx="22" ry="12" fill="#223F61"/><text x="24" y="29" fontSize="12.5" fill="#fff" fontWeight="bold" textAnchor="middle" fontFamily="Inter,Arial,sans-serif">MariaDB</text></svg>
);
const SVG_TensorFlow = (
  <svg viewBox="0 0 48 48" className="w-10 h-10"><rect width="48" height="48" rx="9" fill="#FFA000"/><text x="24" y="29" fontSize="11.5" fill="#fff" fontWeight="bold" textAnchor="middle" fontFamily="Inter,Arial,sans-serif">TensorFlow</text></svg>
);
const SVG_TypeScript = (
  <svg viewBox="0 0 48 48" className="w-10 h-10"><rect width="48" height="48" rx="9" fill="#3178C6"/><text x="24" y="29" fontSize="12.5" fill="#fff" fontWeight="bold" textAnchor="middle" fontFamily="Inter,Arial,sans-serif">TS</text></svg>
);
const SVG_Gradle = (
  <svg viewBox="0 0 48 48" className="w-10 h-10"><rect width="48" height="48" rx="9" fill="#62B047"/><text x="24" y="29" fontSize="12" fill="#fff" fontWeight="bold" textAnchor="middle" fontFamily="Inter,Arial,sans-serif">Gradle</text></svg>
);
const SVG_PyTorch = (
  <svg viewBox="0 0 48 48" className="w-10 h-10"><rect width="48" height="48" rx="9" fill="#EE4C2C"/><text x="24" y="29" fontSize="11.5" fill="#fff" fontWeight="bold" textAnchor="middle" fontFamily="Inter,Arial,sans-serif">PyTorch</text></svg>
);
const SVG_Postman = (
  <svg viewBox="0 0 48 48" className="w-10 h-10"><circle cx="24" cy="24" r="22" fill="#FF6C37"/><text x="24" y="29" fontSize="12.5" fill="#fff" fontWeight="bold" textAnchor="middle" fontFamily="Inter,Arial,sans-serif">Postman</text></svg>
);
const SVG_Redis = (
  <svg viewBox="0 0 48 48" className="w-10 h-10"><ellipse cx="24" cy="24" rx="22" ry="12" fill="#D82C20"/><text x="24" y="29" fontSize="13" fill="#fff" fontWeight="bold" textAnchor="middle" fontFamily="Inter,Arial,sans-serif">Redis</text></svg>
);
const SVG_Jenkins = (
  <svg viewBox="0 0 48 48" className="w-10 h-10"><circle cx="24" cy="24" r="22" fill="#D24939"/><text x="24" y="29" fontSize="12.5" fill="#fff" fontWeight="bold" textAnchor="middle" fontFamily="Inter,Arial,sans-serif">Jenkins</text></svg>
);

// ——— Top and Bottom Logos Data ———
const topLogos = [
  { name: "Python", svg: SVG_Python },
  { name: "PHP", svg: SVG_PHP },
  { name: "HTML5", svg: <Html5 size={40} color="#E44D26" /> },
  { name: "React", svg: <ReactIcon size={40} color="#61DAFB" /> },
  { name: "Vue.js", svg: <Vuejs size={40} color="#42B883" /> },
  { name: "Node.js", svg: <Nodejs size={40} color="#8CC84B" /> },
  { name: "Spring Boot", svg: SVG_SpringBoot },
  { name: "Laravel", svg: SVG_Laravel },
  { name: "MySQL", svg: SVG_MySQL },
  { name: "PostgreSQL", svg: SVG_PostgreSQL },
  { name: "MariaDB", svg: SVG_MariaDB },
  { name: "TensorFlow", svg: SVG_TensorFlow },
  { name: "TypeScript", svg: SVG_TypeScript },
];
const bottomLogos = [
  { name: "Gradle", svg: SVG_Gradle },
  { name: "PyTorch", svg: SVG_PyTorch },
  { name: "Postman", svg: SVG_Postman },
  { name: "Redis", svg: SVG_Redis },
  { name: "Docker", svg: <Docker size={40} color="#2496ED" /> },
  { name: "Jenkins", svg: SVG_Jenkins },
  { name: "Git", svg: <Git size={40} color="#F05032" /> },
  { name: "AWS", svg: <Aws size={40} color="#FF9900" /> },
];

// ——— Logo Carousel: Animated w/ arrows, auto-scroll, responsive ———
interface LogoCarouselProps {
  logos: typeof topLogos;
  interval?: number;
  direction?: "left" | "right";
}
function LogoCarousel({ logos, interval = 2300, direction = "right" }: LogoCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);

  React.useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      if (direction === "right") api.scrollNext();
      else api.scrollPrev();
    }, interval);
    return () => clearInterval(id);
  }, [api, direction, interval]);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      setApi={setApi}
      className="w-full max-w-5xl mx-auto"
    >
      <CarouselContent>
        {logos.map((logo, idx) => (
          <CarouselItem
            key={logo.name}
            className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/8 flex justify-center"
          >
            <div
              className="w-24 h-20 md:w-28 md:h-24 border border-cyan-400/50 rounded-xl bg-black/25 flex items-center justify-center transition-transform duration-200 hover:scale-110 hover:shadow-[0_0_20px_2px_#2fff6faa] hover:border-cyan-400"
              title={logo.name}
            >
              {logo.svg}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 md:-left-10 bg-black/60 border-cyan-400/50 text-cyan-200 hover:bg-cyan-700/80" />
      <CarouselNext className="right-0 md:-right-10 bg-black/60 border-cyan-400/50 text-cyan-200 hover:bg-cyan-700/80" />
    </Carousel>
  );
}

// ——— MAIN SECTION ———
const TechnologiesWeUseSection: React.FC = () => (
  <section
    className="relative py-16 md:py-24 w-full min-h-[620px] flex items-center justify-center
      bg-gradient-to-br from-[#13161C] via-[#191B23] to-[#27243a] overflow-hidden"
    aria-label="Technologies We Use Section"
  >
    {/* Decorative radial bg for tech style */}
    <div
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 50% 18%, #2fff6f22 66%, transparent 100%)"
      }}
    />
    {/* Main content block */}
    <div className="relative z-10 max-w-5xl w-full mx-auto px-3 sm:px-6 flex flex-col items-center">
      {/* Section Title */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center tracking-tight mb-5 font-sans">
        <span className="text-[#2FFF6F] drop-shadow-lg">Technologies</span>{" "}
        <span className="text-gray-100">We Use</span>
      </h2>
      {/* Description */}
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
      {/* Logo Carousels */}
      <div className="space-y-8 w-full">
        <LogoCarousel logos={topLogos} interval={2200} direction="right" />
        <LogoCarousel logos={bottomLogos} interval={2700} direction="left" />
      </div>
    </div>
  </section>
);

export default TechnologiesWeUseSection;
