
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SkillItem } from "@/types/database";

interface SkillCarouselProps {
  skillId: string;
}

const SkillCarousel = ({ skillId }: SkillCarouselProps) => {
  const [items, setItems] = useState<SkillItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkillItems = async () => {
      if (!skillId) return;
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('skill_items' as any)
          .select('*')
          .eq('skill_id', skillId)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching skill items:', error);
          setItems([]);
          return;
        }
        setItems((data as unknown as SkillItem[]) || []);
      } catch (error) {
        console.error('Failed to fetch skill items:', error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkillItems();
  }, [skillId]);

  const hasTransparentBackground = (url: string) => {
    return url.startsWith('blob:') || url.startsWith('data:image/png;base64,');
  };

  // --- STYLES ----
  // We'll inject a custom keyframes on the page for moving the carousel (no duplication) right-to-left.
  // Total width = items.length * 216 (item width + padding)
  const getCarouselWidth = () => `${items.length * 216}px`;

  useEffect(() => {
    // Add keyframes for @keyframes scroll-rtl-once
    const styleId = "skill-carousel-once-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes scroll-rtl-once {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-skill-rtl-once {
          animation: scroll-rtl-once 15s linear infinite;
        }
        .pause-on-hover:hover {
          animation-play-state: paused;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="w-full py-6">
        <div className="container mx-auto">
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No items in this skill category yet.
      </div>
    );
  }

  const isSingleItem = items.length === 1;

  return (
    <div className="w-full py-6 bg-secondary/10 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-4">Gallery</h2>
        <div className="relative max-w-5xl mx-auto">
          {isSingleItem ? (
            <div className="flex justify-center">
              <div className="flex-shrink-0 px-2">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Card className="overflow-hidden border-none h-40 w-[280px] cursor-pointer">
                      <CardContent className="p-0 h-full">
                        <div
                          className={cn(
                            "w-full h-full transition-all duration-500",
                            items[0].animation_type === 'scale' && "hover:scale-110",
                            items[0].animation_type === 'move' && "hover:translate-y-[-10px]",
                            items[0].animation_type === 'fade' && "hover:opacity-80",
                            hasTransparentBackground(items[0].image_url) ? "bg-gradient-to-r from-secondary/30 to-background" : "bg-cover bg-center"
                          )}
                          style={hasTransparentBackground(items[0].image_url)
                            ? {}
                            : { backgroundImage: `url(${items[0].image_url})` }
                          }
                        >
                          {hasTransparentBackground(items[0].image_url) && (
                            <img
                              src={items[0].image_url}
                              alt={items[0].label}
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-72 p-3">
                    <div>
                      <h4 className="font-semibold mb-1">{items[0].label}</h4>
                      {items[0].description && <p className="text-sm text-muted-foreground">{items[0].description}</p>}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div
                className={cn("flex pause-on-hover animate-skill-rtl-once")}
                style={{
                  width: getCarouselWidth(),
                  minWidth: getCarouselWidth(),
                  gap: "0.5rem",
                }}
              >
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-[200px] px-2"
                  >
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Card className="overflow-hidden border-none h-40 cursor-pointer">
                          <CardContent className="p-0 h-full">
                            <div
                              className={cn(
                                "w-full h-full transition-all duration-500",
                                item.animation_type === 'scale' && "hover:scale-110",
                                item.animation_type === 'move' && "hover:translate-y-[-10px]",
                                item.animation_type === 'fade' && "hover:opacity-80",
                                hasTransparentBackground(item.image_url) ? "bg-gradient-to-r from-secondary/30 to-background" : "bg-cover bg-center"
                              )}
                              style={hasTransparentBackground(item.image_url)
                                ? {}
                                : { backgroundImage: `url(${item.image_url})` }
                              }
                            >
                              {hasTransparentBackground(item.image_url) && (
                                <img
                                  src={item.image_url}
                                  alt={item.label}
                                  className="w-full h-full object-contain"
                                />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-72 p-3">
                        <div>
                          <h4 className="font-semibold mb-1">{item.label}</h4>
                          {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillCarousel;
