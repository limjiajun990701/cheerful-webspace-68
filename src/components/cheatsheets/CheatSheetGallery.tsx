
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, FileText, Grid2X2, List, Edit, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CheatSheetViewer from "./CheatSheetViewer";

interface CheatSheet {
  id: string;
  title: string;
  description: string;
  language: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  tags: string[];
}

interface CheatSheetGalleryProps {
  isAdmin: boolean;
}

const CheatSheetGallery: React.FC<CheatSheetGalleryProps> = ({ isAdmin }) => {
  const [cheatSheets, setCheatSheets] = useState<CheatSheet[]>([]);
  const [filteredSheets, setFilteredSheets] = useState<CheatSheet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSheet, setSelectedSheet] = useState<CheatSheet | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCheatSheets();
  }, []);

  useEffect(() => {
    filterCheatSheets();
  }, [searchQuery, language, cheatSheets]);

  const fetchCheatSheets = async () => {
    try {
      // This would be replaced with actual Supabase query
      // For now using placeholder data
      const dummyData: CheatSheet[] = [
        {
          id: "1",
          title: "Git Commands",
          description: "Essential Git commands for daily use",
          language: "git",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: "admin",
          tags: ["version control", "git", "development"]
        },
        {
          id: "2",
          title: "JavaScript Array Methods",
          description: "Common array methods in JavaScript",
          language: "javascript",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: "admin",
          tags: ["javascript", "programming", "arrays"]
        },
        {
          id: "3",
          title: "Linux Terminal Commands",
          description: "Useful commands for Linux terminal",
          language: "bash",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: "admin",
          tags: ["linux", "terminal", "commands"]
        }
      ];
      
      setCheatSheets(dummyData);
      setFilteredSheets(dummyData);
    } catch (error) {
      console.error("Error fetching cheat sheets:", error);
      toast({
        title: "Error",
        description: "Failed to load cheat sheets",
        variant: "destructive"
      });
    }
  };

  const filterCheatSheets = () => {
    let filtered = [...cheatSheets];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(sheet => 
        sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sheet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sheet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by language
    if (language !== "all") {
      filtered = filtered.filter(sheet => sheet.language === language);
    }
    
    setFilteredSheets(filtered);
  };

  const handleDeleteCheatSheet = async (id: string) => {
    try {
      // This would be replaced with actual Supabase deletion
      setCheatSheets(cheatSheets.filter(sheet => sheet.id !== id));
      setFilteredSheets(filteredSheets.filter(sheet => sheet.id !== id));
      
      toast({
        title: "Success",
        description: "Cheat sheet deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting cheat sheet:", error);
      toast({
        title: "Error",
        description: "Failed to delete cheat sheet",
        variant: "destructive"
      });
    }
  };

  const openCheatSheet = (sheet: CheatSheet) => {
    setSelectedSheet(sheet);
  };

  const closeCheatSheet = () => {
    setSelectedSheet(null);
  };

  return (
    <div className="space-y-6">
      {selectedSheet ? (
        <div className="space-y-4">
          <Button variant="outline" onClick={closeCheatSheet}>
            Back to Gallery
          </Button>
          <CheatSheetViewer cheatSheet={selectedSheet} />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search cheat sheets..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="git">Git</SelectItem>
                  <SelectItem value="bash">Bash/Terminal</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none rounded-l-md"
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-none rounded-r-md"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {filteredSheets.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No cheat sheets found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {filteredSheets.map((sheet) => (
                <Card key={sheet.id} className={`${viewMode === "list" ? "flex flex-row" : ""} overflow-hidden`}>
                  {viewMode === "list" ? (
                    <>
                      <div className="p-6 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{sheet.title}</h3>
                            <p className="text-muted-foreground text-sm mt-1">{sheet.description}</p>
                          </div>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="ghost" onClick={() => openCheatSheet(sheet)}>
                              View
                            </Button>
                            {isAdmin && (
                              <>
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteCheatSheet(sheet.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 text-xs rounded-md bg-primary/10 text-primary">
                            {sheet.language}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <CardHeader>
                        <CardTitle>{sheet.title}</CardTitle>
                        <CardDescription>{sheet.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          <span className="inline-block px-2 py-1 text-xs rounded-md bg-primary/10 text-primary">
                            {sheet.language}
                          </span>
                          {sheet.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="inline-block px-2 py-1 text-xs rounded-md bg-secondary/20 text-secondary-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => openCheatSheet(sheet)}>
                          View
                        </Button>
                        {isAdmin && (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteCheatSheet(sheet.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </CardFooter>
                    </>
                  )}
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CheatSheetGallery;
