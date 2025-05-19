
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Grid2X2, List, Edit, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CheatSheetViewer from "./CheatSheetViewer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheatSheet } from "@/types/cheatsheet";
import { useNavigate } from "react-router-dom";

interface CheatSheetGalleryProps {
  isAdmin: boolean;
  selectedSheetId?: string | null;
}

const CheatSheetGallery: React.FC<CheatSheetGalleryProps> = ({ isAdmin, selectedSheetId }) => {
  const [filteredSheets, setFilteredSheets] = useState<CheatSheet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSheet, setSelectedSheet] = useState<CheatSheet | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch cheatsheets from Supabase
  const { data: cheatSheets = [], isLoading } = useQuery({
    queryKey: ['cheatsheets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cheatsheets')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error("Error fetching cheat sheets:", error);
        throw new Error(error.message);
      }

      return data as CheatSheet[];
    }
  });

  // Fetch specific cheatsheet if ID is provided
  const { data: specificSheet, isLoading: isLoadingSpecificSheet } = useQuery({
    queryKey: ['specific-cheatsheet', selectedSheetId],
    queryFn: async () => {
      if (!selectedSheetId) return null;
      
      const { data, error } = await supabase
        .from('cheatsheets')
        .select('*')
        .eq('id', selectedSheetId)
        .single();

      if (error) {
        console.error("Error fetching specific cheat sheet:", error);
        throw new Error(error.message);
      }

      return data as CheatSheet;
    },
    enabled: !!selectedSheetId
  });

  // Delete cheatsheet mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Check if user is admin before allowing deletion
      if (!isAdmin) {
        throw new Error("Unauthorized: Only admins can delete cheat sheets");
      }
      
      const { error } = await supabase
        .from('cheatsheets')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cheatsheets'] });
      queryClient.invalidateQueries({ queryKey: ['admin-cheatsheets'] });
      
      toast({
        title: "Success",
        description: "Cheat sheet deleted successfully",
      });
      
      // Close the viewer if the deleted sheet was being viewed
      if (selectedSheet) {
        setSelectedSheet(null);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete cheat sheet: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Set up filtering of cheatsheets
  useEffect(() => {
    filterCheatSheets();
  }, [searchQuery, language, cheatSheets]);

  // Set selected sheet when a specific ID is provided
  useEffect(() => {
    if (specificSheet) {
      setSelectedSheet(specificSheet);
    }
  }, [specificSheet]);

  const filterCheatSheets = () => {
    let filtered = [...cheatSheets];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(sheet => 
        sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sheet.description && sheet.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by language
    if (language !== "all") {
      filtered = filtered.filter(sheet => sheet.language === language);
    }
    
    setFilteredSheets(filtered);
  };

  const handleEditCheatSheet = (sheet: CheatSheet) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can edit cheat sheets",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to edit tab with the selected sheet ID
    navigate(`/cheatsheets?tab=create&id=${sheet.id}`);
  };

  const handleDeleteCheatSheet = async (id: string) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can delete cheat sheets",
        variant: "destructive"
      });
      return;
    }
    
    if (confirm("Are you sure you want to delete this cheat sheet? This action cannot be undone.")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error in delete handler:", error);
      }
    }
  };

  const openCheatSheet = (sheet: CheatSheet) => {
    setSelectedSheet(sheet);
    
    // Update URL to include sheet ID for direct linking
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("id", sheet.id);
    navigate(`${window.location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  const closeCheatSheet = () => {
    setSelectedSheet(null);
    
    // Remove sheet ID from URL
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("id");
    navigate(`${window.location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  // Show loading state while fetching specific sheet
  if (selectedSheetId && isLoadingSpecificSheet) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-muted-foreground">Loading cheat sheet...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedSheet ? (
        <div className="space-y-4">
          <Button variant="outline" onClick={closeCheatSheet}>
            Back to Gallery
          </Button>
          <CheatSheetViewer cheatSheet={selectedSheet} isAdmin={isAdmin} />
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
                  <SelectItem value="bash">Bash</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
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
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-muted-foreground">Loading cheat sheets...</p>
            </div>
          ) : filteredSheets.length === 0 ? (
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
                                <Button size="sm" variant="ghost" onClick={() => handleEditCheatSheet(sheet)}>
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
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => openCheatSheet(sheet)}>
                          View
                        </Button>
                        {isAdmin && (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditCheatSheet(sheet)}>
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
