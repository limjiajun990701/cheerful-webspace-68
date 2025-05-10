
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  
  // Render loading state
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
  
  // Return null if no items
  if (items.length === 0) {
    return null;
  }
  
  // Check if we have only a single item
  const isSingleItem = items.length === 1;
  
  // Duplicate the items to create a seamless loop effect, but only if we have more than one item
  const displayItems = isSingleItem ? items : [...items, ...items];
  
  return (
    <div className="w-full py-6 bg-secondary/10 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-4">Gallery</h2>
        
        <div className="relative max-w-5xl mx-auto">
          <div className={cn(
            "flex",
            !isSingleItem && "animate-scroll-rtl" // Only apply animation if we have multiple items
          )}>
            {displayItems.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className={cn(
                  "flex-shrink-0 px-2",
                  isSingleItem ? "w-full flex justify-center" : "w-[200px]"
                )}
              >
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Card 
                      className={cn(
                        "overflow-hidden border-none h-40 cursor-pointer",
                        isSingleItem && "w-[280px]"
                      )}
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
                          {/* No labels as requested */}
                        </div>
                      </CardContent>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-72 p-3">
                    <div>
                      <h4 className="font-semibold mb-1">{item.label}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCarousel;
