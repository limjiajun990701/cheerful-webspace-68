
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CollectionItem {
  id: string;
  image_url: string;
  label: string;
  description: string | null;
  animation_type: string | null;
  display_order: number | null;
}

interface CollectionCarouselProps {
  collectionId?: string;
}

const CollectionCarousel = ({ collectionId }: CollectionCarouselProps) => {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentApi, setCurrentApi] = useState<any>(null);
  
  // Fetch collection items from the database
  useEffect(() => {
    const fetchCollectionItems = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('collection_items')
          .select('*')
          .order('display_order', { ascending: true });
          
        // If collectionId is provided, filter by it
        if (collectionId) {
          query = query.eq('collection_id', collectionId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching collection items:', error);
          return;
        }
        
        setItems(data || []);
      } catch (error) {
        console.error('Failed to fetch collection items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCollectionItems();
  }, [collectionId]);
  
  // Auto-scroll effect that continuously scrolls left
  useEffect(() => {
    if (!currentApi || items.length <= 1) return;
    
    const interval = setInterval(() => {
      currentApi.scrollNext();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [currentApi, items.length]);
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="w-full py-10">
        <div className="container mx-auto">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  
  // Return null if no items
  if (items.length === 0) {
    return null;
  }
  
  return (
    <div className="w-full py-16 bg-secondary/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Gallery</h2>
        
        <Carousel
          setApi={setCurrentApi}
          className="max-w-5xl mx-auto"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {items.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Card 
                      className="overflow-hidden border-none h-64 cursor-pointer"
                    >
                      <CardContent className="p-0 h-full">
                        <div 
                          className={cn(
                            "w-full h-full bg-cover bg-center transition-all duration-500",
                            item.animation_type === 'scale' && "hover:scale-110",
                            item.animation_type === 'move' && "hover:translate-y-[-10px]",
                            item.animation_type === 'fade' && "hover:opacity-80"
                          )}
                          style={{ backgroundImage: `url(${item.image_url})` }}
                        >
                          {/* Label div removed as requested */}
                        </div>
                      </CardContent>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-4">
                    <div>
                      <h4 className="font-semibold mb-2">{item.label}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Hide the navigation buttons as auto-scrolling is enabled */}
        </Carousel>
      </div>
    </div>
  );
};

export default CollectionCarousel;
