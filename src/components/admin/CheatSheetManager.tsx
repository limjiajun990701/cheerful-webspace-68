
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search, Plus, Pencil, Trash2, FileDown, Loader2 } from "lucide-react";
import { CheatSheet } from "@/types/cheatsheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CheatSheetEditor from "@/components/cheatsheets/CheatSheetEditor";
import { useNavigate } from "react-router-dom";

const CheatSheetManager = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [editingSheet, setEditingSheet] = useState<CheatSheet | null>(null);
  const [activeTab, setActiveTab] = useState("browse");

  // Fetch cheatsheets
  const { data: allCheatSheets = [], isLoading } = useQuery({
    queryKey: ['admin-cheatsheets'],
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

  // Filter cheatsheets based on search and language
  const cheatSheets = allCheatSheets.filter(sheet => {
    const matchesSearch = searchQuery === "" || 
      sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sheet.description && sheet.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLanguage = language === "all" || sheet.language === language;
    
    return matchesSearch && matchesLanguage;
  });

  // Delete cheatsheet mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cheatsheets')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cheatsheets'] });
      toast({
        title: "Success",
        description: "Cheat sheet deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete cheat sheet: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleEdit = (sheet: CheatSheet) => {
    setEditingSheet(sheet);
    setActiveTab("edit");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this cheat sheet? This action cannot be undone.")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handlePreview = (sheet: CheatSheet) => {
    navigate(`/cheatsheets?tab=browse&id=${sheet.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">Cheat Sheets Management</h2>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="default" 
            onClick={() => {
              setEditingSheet(null);
              setActiveTab("create");
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Cheat Sheet
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="browse">Browse Cheat Sheets</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
          {editingSheet && <TabsTrigger value="edit">Edit {editingSheet.title}</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="browse" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Manage Cheat Sheets</CardTitle>
              <CardDescription>View, edit or delete your cheat sheets</CardDescription>
              
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search cheat sheets..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
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
              </div>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="mt-2">Loading cheat sheets...</p>
                </div>
              ) : cheatSheets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No cheat sheets found</p>
                  <p className="text-sm mt-1">Try adjusting your filters or create a new cheat sheet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {cheatSheets.map((sheet) => (
                    <div key={sheet.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-grow space-y-1">
                        <div className="flex items-start">
                          <div>
                            <h3 className="font-medium">{sheet.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {sheet.description || "No description"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">
                                {sheet.language}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Last updated: {new Date(sheet.updated_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end md:self-center">
                        <Button variant="outline" size="sm" onClick={() => handlePreview(sheet)}>
                          <FileDown className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(sheet)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(sheet.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Cheat Sheet</CardTitle>
              <CardDescription>Add a new cheat sheet to your collection</CardDescription>
            </CardHeader>
            <CardContent>
              <CheatSheetEditor onSuccess={() => setActiveTab("browse")} />
            </CardContent>
          </Card>
        </TabsContent>

        {editingSheet && (
          <TabsContent value="edit" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Edit Cheat Sheet</CardTitle>
                <CardDescription>Modify the selected cheat sheet</CardDescription>
              </CardHeader>
              <CardContent>
                <CheatSheetEditor 
                  cheatsheetToEdit={editingSheet} 
                  onSuccess={() => setActiveTab("browse")} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default CheatSheetManager;
