
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, X, FileDown, Copy, Save, Trash2, MoveVertical, FileText, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CheatSheetPreview from "./CheatSheetPreview";

interface CheatSheetEntry {
  id: string;
  command: string;
  description: string;
  language?: string;
}

interface CheatSheetGroup {
  id: string;
  title: string;
  entries: CheatSheetEntry[];
}

const CheatSheetEditor: React.FC = () => {
  const [title, setTitle] = useState("New Cheat Sheet");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [groups, setGroups] = useState<CheatSheetGroup[]>([
    {
      id: "group-1",
      title: "Basic Commands",
      entries: [
        { id: "entry-1", command: "npm install", description: "Install dependencies" },
        { id: "entry-2", command: "npm start", description: "Start development server" }
      ]
    }
  ]);
  const { toast } = useToast();

  const addGroup = () => {
    const newGroup: CheatSheetGroup = {
      id: `group-${Date.now()}`,
      title: "New Group",
      entries: []
    };
    setGroups([...groups, newGroup]);
  };

  const updateGroupTitle = (groupId: string, newTitle: string) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, title: newTitle } : group
    ));
  };

  const deleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
  };

  const addEntry = (groupId: string) => {
    const newEntry: CheatSheetEntry = {
      id: `entry-${Date.now()}`,
      command: "",
      description: ""
    };
    
    setGroups(groups.map(group => 
      group.id === groupId ? 
        { ...group, entries: [...group.entries, newEntry] } : 
        group
    ));
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

  const saveCheatSheet = async () => {
    try {
      // This would be replaced with actual Supabase insert/update
      toast({
        title: "Success",
        description: "Cheat sheet saved successfully",
      });
    } catch (error) {
      console.error("Error saving cheat sheet:", error);
      toast({
        title: "Error",
        description: "Failed to save cheat sheet",
        variant: "destructive"
      });
    }
  };

  const exportCheatSheet = (format: string) => {
    // This would implement export functionality based on format
    toast({
      title: "Export Started",
      description: `Exporting as ${format}...`,
    });
  };

  const copyToClipboard = (format: string) => {
    // This would implement clipboard copy functionality for HTML or Markdown
    toast({
      title: "Copied!",
      description: `${format} copied to clipboard`,
    });
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

  return (
    <div>
      <Tabs defaultValue="edit">
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
            <Button onClick={saveCheatSheet} className="flex-1 sm:flex-none">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <div className="dropdown relative ml-auto">
              <Button variant="outline" className="flex-1 sm:flex-none">
                <FileDown className="h-4 w-4 mr-2" />
                Export
              </Button>
              <div className="dropdown-content hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-popover border z-10 p-1">
                <Button variant="ghost" className="w-full justify-start" onClick={() => exportCheatSheet("pdf")}>
                  Export as PDF
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => exportCheatSheet("image")}>
                  Export as Image
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => exportCheatSheet("html")}>
                  Export as HTML
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => exportCheatSheet("markdown")}>
                  Export as Markdown
                </Button>
              </div>
            </div>
            
            <div className="dropdown relative">
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <div className="dropdown-content hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-popover border z-10 p-1">
                <Button variant="ghost" className="w-full justify-start" onClick={() => copyToClipboard("html")}>
                  Copy as HTML
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => copyToClipboard("markdown")}>
                  Copy as Markdown
                </Button>
              </div>
            </div>
            
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Code className="h-4 w-4 mr-2" />
              Templates
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
