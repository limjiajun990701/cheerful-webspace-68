
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import CollectionCarousel from "@/components/collections/CollectionCarousel";

interface Collection {
  id: string;
  name: string;
  description: string | null;
}

const Collections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch collections on component mount
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setCollections(data || []);
        
        // Select the first collection if available
        if (data?.length) {
          setSelectedCollection(data[0].id);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setIsLoading(false);
      }
    };
    
    fetchCollections();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center">Collections</h1>
        <div className="max-w-md mx-auto">
          <Skeleton className="h-10 w-full mb-8" />
          <Skeleton className="h-64 w-full rounded-lg mb-8" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center">Collections</h1>
        <p className="text-center text-muted-foreground">No collections available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">Collections</h1>
      
      <Tabs 
        value={selectedCollection || ""} 
        onValueChange={setSelectedCollection}
        className="max-w-5xl mx-auto"
      >
        <TabsList className="mb-8 w-full flex justify-center flex-wrap gap-2 bg-transparent">
          {collections.map(collection => (
            <TabsTrigger 
              key={collection.id} 
              value={collection.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {collection.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {collections.map(collection => (
          <TabsContent key={collection.id} value={collection.id}>
            {collection.description && (
              <p className="text-center text-muted-foreground mb-8">{collection.description}</p>
            )}
            <CollectionCarousel collectionId={collection.id} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Collections;
