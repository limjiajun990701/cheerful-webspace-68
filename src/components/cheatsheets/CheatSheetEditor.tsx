import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, X, Save, Trash2, MoveVertical, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/hooks/useAuth";
import { CheatSheet, CheatSheetGroup, CheatSheetEntry } from "@/types/cheatsheet"; // Only use the imported types
import CheatSheetPreview from "./CheatSheetPreview";

interface CheatSheetEditorProps {
  cheatsheetToEdit?: CheatSheet;
  onSuccess?: () => void;
}

const CheatSheetEditor: React.FC<CheatSheetEditorProps> = ({ cheatsheetToEdit, onSuccess }) => {
  const [title, setTitle] = useState(cheatsheetToEdit?.title || "New Cheat Sheet");
  const [description, setDescription] = useState(cheatsheetToEdit?.description || "");
  const [language, setLanguage] = useState(cheatsheetToEdit?.language || "javascript");
  const [groups, setGroups] = useState<CheatSheetGroup[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isLoggedIn, username } = useAuth();
  const [adminUserId, setAdminUserId] = useState<string | null>(null);
  const [isUuidLoading, setIsUuidLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const isEditMode = !!cheatsheetToEdit;

  // Fetch groups and entries if editing an existing cheatsheet
  const { isLoading: isLoadingGroups } = useQuery({
    queryKey: ['cheatsheet-editor-groups', cheatsheetToEdit?.id],
    queryFn: async () => {
      if (!cheatsheetToEdit) return null;
      const { data: groupsData, error: groupsError } = await supabase
        .from('cheatsheet_groups')
        .select('*')
        .eq('cheatsheet_id', cheatsheetToEdit.id)
        .order('display_order', { ascending: true });
      if (groupsError) {
        console.error("Error fetching cheat sheet groups:", groupsError);
        throw new Error(groupsError.message);
      }
      // Fetch entries for each group
      const groupsWithEntries: CheatSheetGroup[] = await Promise.all(
        groupsData.map(async (group: any) => {
          const { data: entriesData, error: entriesError } = await supabase
            .from('cheatsheet_entries')
            .select('*')
            .eq('group_id', group.id)
            .order('display_order', { ascending: true });
          if (entriesError) {
            console.error("Error fetching cheat sheet entries:", entriesError);
            throw new Error(entriesError.message);
          }
          return {
            ...group,
            entries: (entriesData || []).map((entry: any): CheatSheetEntry => ({
              id: entry.id,
              command: entry.command || "",
              description: entry.description || "",
              group_id: entry.group_id, // Ensure always present
              display_order: entry.display_order
            }))
          };
        })
      );
      setGroups(groupsWithEntries);
      return groupsWithEntries;
    },
    enabled: !!cheatsheetToEdit,
  });

  useEffect(() => {
    // Initialize with a default group if creating new cheat sheet
    if (!cheatsheetToEdit && groups.length === 0) {
      setGroups([{
        id: uuidv4(),
        cheatsheet_id: "",
        title: "Basic Commands",
        display_order: 0,
        entries: [
          {
            id: uuidv4(),
            command: "Example command",
            description: "Description of what this command does",
            group_id: "", // Always set group_id
            display_order: 0
          }
        ]
      }]);
    }
  }, [cheatsheetToEdit]);

  // Fetch the admin user's UUID on mount for new cheat sheet creation
  useEffect(() => {
    if (!cheatsheetToEdit && isLoggedIn && username) {
      setIsUuidLoading(true);
      supabase
        .from('admin_users')
        .select('id')
        .eq('username', username)
        .maybeSingle()
        .then(({ data, error }) => {
          setAdminUserId(data?.id ?? null);
          setIsUuidLoading(false);
        });
    }
  }, [cheatsheetToEdit, isLoggedIn, username]);

  const addGroup = () => {
    const newGroup: CheatSheetGroup = {
      id: uuidv4(),
      cheatsheet_id: "",
      title: "New Group",
      display_order: groups.length,
      entries: []
    };
    setGroups([...groups, newGroup]);
  };

  const addEntry = (groupId: string) => {
    const newEntry: CheatSheetEntry = {
      id: uuidv4(),
      command: "",
      description: "",
      group_id: groupId,
      display_order: (groups.find(g => g.id === groupId)?.entries.length || 0)
    };

    setGroups(groups.map(group =>
      group.id === groupId ?
        { ...group, entries: [...group.entries, newEntry] } :
        group
    ));
  };

  const updateGroupTitle = (groupId: string, newTitle: string) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, title: newTitle } : group
    ));
  };

  const deleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
  };

  const updateEntry = (groupId: string, entryId: string, field: keyof CheatSheetEntry, value: string) => {
    setGroups(groups.map(group => 
      group.id === groupId ? 
        { 
          ...group, 
          entries: group.entries.map(entry => 
            entry.id === entryId ? 
              { ...entry, [field]: value } : 
              entry
          ) 
        } : 
        group
    ));
  };

  const deleteEntry = (groupId: string, entryId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId ? 
        { ...group, entries: group.entries.filter(entry => entry.id !== entryId) } : 
        group
    ));
  };

  // Create or update cheatsheet mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      setIsSaving(true);

      // ---- Remove any supabase.auth.getUser() checks! ----
      // Use only isLoggedIn and local adminUserId for admin feature gating

      // Only validate our custom admin logic for edit mode
      if (isEditMode) {
        // Update existing cheatsheet
        const { error: updateError } = await supabase
          .from('cheatsheets')
          .update({
            title,
            description,
            language,
            updated_at: new Date().toISOString()
          })
          .eq('id', cheatsheetToEdit.id);
        
        if (updateError) throw new Error(updateError.message);
        
        // Delete existing groups and entries to recreate them
        // This is simpler than tracking what changed
        const { error: deleteGroupsError } = await supabase
          .from('cheatsheet_groups')
          .delete()
          .eq('cheatsheet_id', cheatsheetToEdit.id);
        
        if (deleteGroupsError) throw new Error(deleteGroupsError.message);
        
        // Create updated groups with display order
        const groupsWithOrder = groups.map((group, index) => ({
          id: group.id,
          cheatsheet_id: cheatsheetToEdit.id,
          title: group.title,
          display_order: index
        }));
        
        const { error: groupsError } = await supabase
          .from('cheatsheet_groups')
          .insert(groupsWithOrder);
        
        if (groupsError) throw new Error(groupsError.message);
        
        // Create entries for each group with display order
        const entriesData = groups.flatMap(group => 
          group.entries.map((entry, index) => ({
            id: entry.id,
            group_id: group.id,
            command: entry.command,
            description: entry.description,
            display_order: index
          }))
        );
        
        if (entriesData.length > 0) {
          const { error: entriesError } = await supabase
            .from('cheatsheet_entries')
            .insert(entriesData);
          
          if (entriesError) throw new Error(entriesError.message);
        }
        
        return cheatsheetToEdit;
        
      } else {
        // Create new cheatsheet
        // Do NOT check or fetch supabase.auth.getUser()
        // Only use local adminUserId if required, otherwise create as "anonymous"/public allowed

        // Remove these lines if present:
        // const { data: user, error: userError } = await supabase.auth.getUser();
        // if (!user) throw new Error("User not authenticated");

        // If you want to allow non-admin creation, you may skip adminUserId entirely OR set created_by to null/empty for public users

        // This will accept both admin and public users:
        const { data: cheatsheetData, error: cheatsheetError } = await supabase
          .from('cheatsheets')
          .insert({
            title,
            description,
            language,
            created_by: adminUserId || null, // If no adminUserId, set to null (public user)
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (cheatsheetError) throw new Error(cheatsheetError.message);

        // Create groups with display order
        const groupsWithOrder = groups.map((group, index) => ({
          id: group.id,
          cheatsheet_id: cheatsheetData.id,
          title: group.title,
          display_order: index
        }));
        
        const { error: groupsError } = await supabase
          .from('cheatsheet_groups')
          .insert(groupsWithOrder);
        
        if (groupsError) throw new Error(groupsError.message);
        
        // Create entries for each group with display order
        const entriesData = groups.flatMap(group => 
          group.entries.map((entry, index) => ({
            id: entry.id,
            group_id: group.id,
            command: entry.command,
            description: entry.description,
            display_order: index
          }))
        );
        
        if (entriesData.length > 0) {
          const { error: entriesError } = await supabase
            .from('cheatsheet_entries')
            .insert(entriesData);
          
          if (entriesError) throw new Error(entriesError.message);
        }
        
        return cheatsheetData;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cheatsheets'] });
      queryClient.invalidateQueries({ queryKey: ['admin-cheatsheets'] });
      
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ['cheatsheet-editor-groups', cheatsheetToEdit.id] });
      }
      
      toast({
        title: "Success",
        description: `Cheat sheet ${isEditMode ? 'updated' : 'created'} successfully`,
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Reset form if no callback
        if (!isEditMode) {
          setTitle("New Cheat Sheet");
          setDescription("");
          setLanguage("javascript");
          setGroups([{
            id: uuidv4(),
            cheatsheet_id: "",
            title: "Group Title",
            display_order: 0,
            entries: []
          }]);
        }
      }
    },
    onError: (error) => {
      console.error("Error saving cheat sheet:", error);
      toast({
        title: "Error",
        description: `Failed to save cheat sheet: ${error.message}`,
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsSaving(false);
    }
  });

  const saveCheatSheet = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in as an admin to create cheat sheets",
        variant: "destructive"
      });
      return;
    }
    if (!isEditMode && !adminUserId) {
      toast({
        title: "Admin User Error",
        description: "Admin user ID not found. Please reload and try again.",
        variant: "destructive"
      });
      return;
    }
    saveMutation.mutate();
  };

  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;
    
    // Dropped outside the list
    if (!destination) {
      return;
    }
    
    // Group reordering
    if (type === "GROUP") {
      const reorderedGroups = [...groups];
      const [removed] = reorderedGroups.splice(source.index, 1);
      reorderedGroups.splice(destination.index, 0, removed);
      setGroups(reorderedGroups);
      return;
    }
    
    // Entry reordering
    const sourceGroupIndex = groups.findIndex(g => g.id === source.droppableId);
    const destGroupIndex = groups.findIndex(g => g.id === destination.droppableId);
    
    if (sourceGroupIndex === -1 || destGroupIndex === -1) {
      return;
    }
    
    // Same group
    if (source.droppableId === destination.droppableId) {
      const newEntries = [...groups[sourceGroupIndex].entries];
      const [removed] = newEntries.splice(source.index, 1);
      newEntries.splice(destination.index, 0, removed);
      
      const newGroups = [...groups];
      newGroups[sourceGroupIndex].entries = newEntries;
      setGroups(newGroups);
    } else {
      // Different groups
      const sourceEntries = [...groups[sourceGroupIndex].entries];
      const destEntries = [...groups[destGroupIndex].entries];
      const [removed] = sourceEntries.splice(source.index, 1);
      destEntries.splice(destination.index, 0, removed);
      
      const newGroups = [...groups];
      newGroups[sourceGroupIndex].entries = sourceEntries;
      newGroups[destGroupIndex].entries = destEntries;
      setGroups(newGroups);
    }
  };

  if (isLoadingGroups || (isUuidLoading && !isEditMode)) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">
          {isUuidLoading ? "Preparing admin account..." : "Loading cheat sheet data..."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-6">
          {/* Cheat Sheet Metadata */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter cheat sheet title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Enter a brief description"
                  />
                </div>
                
                <div>
                  <Label htmlFor="language">Primary Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="git">Git</SelectItem>
                      <SelectItem value="bash">Bash/Terminal</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                      <SelectItem value="sql">SQL</SelectItem>
                      <SelectItem value="markdown">Markdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Cheat Sheet Content */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="groups" type="GROUP">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-6"
                >
                  {groups.map((group, groupIndex) => (
                    <Draggable 
                      key={group.id} 
                      draggableId={group.id} 
                      index={groupIndex}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="relative"
                        >
                          <div 
                            {...provided.dragHandleProps} 
                            className="absolute right-2 top-2 p-1 rounded hover:bg-muted cursor-move"
                          >
                            <MoveVertical className="h-5 w-5" />
                          </div>
                          
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 mr-4">
                                  <Input 
                                    value={group.title} 
                                    onChange={(e) => updateGroupTitle(group.id, e.target.value)}
                                    className="font-medium text-lg"
                                    placeholder="Group Title"
                                  />
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => deleteGroup(group.id)}
                                  className="h-8 w-8"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <Droppable droppableId={group.id} type="ENTRY">
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="space-y-3"
                                  >
                                    {group.entries.map((entry, entryIndex) => (
                                      <Draggable
                                        key={entry.id}
                                        draggableId={entry.id}
                                        index={entryIndex}
                                      >
                                        {(provided) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="flex items-start border rounded-md p-3 bg-card"
                                          >
                                            <div
                                              {...provided.dragHandleProps}
                                              className="mt-2 mr-2 cursor-move"
                                            >
                                              <MoveVertical className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                              <div>
                                                <Label htmlFor={`command-${entry.id}`} className="text-xs">
                                                  Command/Syntax
                                                </Label>
                                                <Textarea
                                                  id={`command-${entry.id}`}
                                                  value={entry.command}
                                                  onChange={(e) => updateEntry(group.id, entry.id, "command", e.target.value)}
                                                  placeholder="Enter command or code"
                                                  className="font-mono text-sm"
                                                  rows={3}
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor={`description-${entry.id}`} className="text-xs">
                                                  Description
                                                </Label>
                                                <Textarea
                                                  id={`description-${entry.id}`}
                                                  value={entry.description}
                                                  onChange={(e) => updateEntry(group.id, entry.id, "description", e.target.value)}
                                                  placeholder="Enter description or explanation"
                                                  className="text-sm"
                                                  rows={3}
                                                />
                                              </div>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => deleteEntry(group.id, entry.id)}
                                              className="ml-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addEntry(group.id)}
                                      className="w-full mt-2"
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Entry
                                    </Button>
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  <Button
                    variant="outline"
                    onClick={addGroup}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Group
                  </Button>
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button 
              onClick={saveCheatSheet}
              className="flex-1 sm:flex-none"
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : isEditMode ? "Update" : "Save"}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          <CheatSheetPreview 
            title={title}
            description={description}
            language={language}
            groups={groups}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CheatSheetEditor;
