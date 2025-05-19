
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CheatSheetGallery from "@/components/cheatsheets/CheatSheetGallery";
import CheatSheetEditor from "@/components/cheatsheets/CheatSheetEditor";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";

const CheatSheets = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="container py-6 md:py-10 max-w-7xl mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Cheat Sheets</h1>
          <p className="text-muted-foreground">
            Access and manage programming cheat sheets for various languages and technologies.
          </p>
        </div>
        
        <Separator className="my-6" />
        
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            {isLoggedIn && <TabsTrigger value="create">Create & Edit</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="browse" className="space-y-8">
            <CheatSheetGallery isAdmin={isLoggedIn} />
          </TabsContent>
          
          {isLoggedIn && (
            <TabsContent value="create" className="space-y-8">
              <CheatSheetEditor />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default CheatSheets;
