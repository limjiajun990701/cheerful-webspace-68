import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Trash, Plus, Image, Pencil, Save, X, Loader2, ImageOff } from "lucide-react";
import { loadImageFromUrl, removeBackground } from "@/utils/imageProcessing";

interface Collection {
  id: string;
  name: string;
  description: string | null;
}

interface CollectionItem {
  id: string;
  collection_id: string;
  image_url: string;
  label: string;
  description: string | null;
  animation_type: string | null;
  display_order: number | null;
}

const CollectionManager = () => {
  const { toast } = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCollection, setNewCollection] = useState({ name: "", description: "" });
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    image_url: "",
    label: "",
    description: "",
    animation_type: "scale",
    display_order: 0
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [imageToProcess, setImageToProcess] = useState<string | null>(null);
  
  // Fetch all collections
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
      if (data?.length && !selectedCollection) {
        setSelectedCollection(data[0].id);
        fetchCollectionItems(data[0].id);
      } else if (selectedCollection) {
        fetchCollectionItems(selectedCollection);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast({
        title: "Error",
        description: "Failed to fetch collections",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  // Fetch items for a specific collection
  const fetchCollectionItems = async (collectionId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('collection_items')
        .select('*')
        .eq('collection_id', collectionId)
        .order('display_order');
      
      if (error) throw error;
      setCollectionItems(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching collection items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch collection items",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  // Load collections on component mount
  useEffect(() => {
    fetchCollections();
  }, []);
  
  // Add new collection
  const handleAddCollection = async () => {
    if (!newCollection.name.trim()) {
      toast({
        title: "Error",
        description: "Collection name is required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('collections')
        .insert([{
          name: newCollection.name,
          description: newCollection.description || null
        }])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Collection created successfully",
      });
      
      setNewCollection({ name: "", description: "" });
      setIsAddingCollection(false);
      fetchCollections();
    } catch (error) {
      console.error('Error creating collection:', error);
      toast({
        title: "Error",
        description: "Failed to create collection",
        variant: "destructive",
      });
    }
  };
  
  // Delete a collection
  const handleDeleteCollection = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this collection? This will also delete all items inside it.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Collection deleted successfully",
      });
      
      if (selectedCollection === id) {
        setSelectedCollection(null);
        setCollectionItems([]);
      }
      
      fetchCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast({
        title: "Error",
        description: "Failed to delete collection",
        variant: "destructive",
      });
    }
  };
  
  // Remove background from image URL
  const handleRemoveBackground = async (imageUrl: string, isNewItem: boolean = true) => {
    try {
      setIsProcessingImage(true);
      setImageToProcess(imageUrl);
      
      toast({
        title: "Processing Image",
        description: "Removing background - this may take a moment...",
      });
      
      // Load the image from URL
      const img = await loadImageFromUrl(imageUrl);
      
      // Remove the background
      const processedBlob = await removeBackground(img);
      
      // Create URL from blob
      const processedUrl = URL.createObjectURL(processedBlob);
      setProcessedImageUrl(processedUrl);
      
      // Update the appropriate state
      if (isNewItem) {
        setNewItem(prev => ({ ...prev, image_url: processedUrl }));
      } else if (editingItem) {
        // Update the edited item's image URL
        setCollectionItems(prev => 
          prev.map(item => item.id === editingItem 
            ? { ...item, image_url: processedUrl } 
            : item
          )
        );
      }
      
      toast({
        title: "Success",
        description: "Background removed successfully!",
      });
    } catch (error) {
      console.error("Error removing background:", error);
      
      // Provide more specific error messages based on the error
      let errorMessage = "Failed to remove background. Please try a different image.";
      
      if (error.message && error.message.includes("webgpu")) {
        errorMessage = "WebGPU is not supported in your browser. Please try a modern browser like Chrome or Edge.";
      } else if (error.message && error.message.includes("CORS")) {
        errorMessage = "The image URL has CORS restrictions. Try uploading the image directly or use a different image source.";
      } else if (error.message && error.message.includes("API error")) {
        errorMessage = "Background removal API error. Please try again later or with a different image.";
      } else if (error.message && error.message.includes("X-Api-Key")) {
        errorMessage = "API key missing or invalid. Please contact your administrator.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessingImage(false);
    }
  };
  
  // Reset image processing states
  const resetImageProcessing = () => {
    setProcessedImageUrl(null);
    setImageToProcess(null);
  };
  
  // Add new item to a collection
  const handleAddItem = async () => {
    if (!selectedCollection) {
      toast({
        title: "Error",
        description: "Please select a collection first",
        variant: "destructive",
      });
      return;
    }
    
    if (!newItem.image_url.trim() || !newItem.label.trim()) {
      toast({
        title: "Error",
        description: "Image URL and label are required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Calculate the next display order
      const nextOrder = collectionItems.length > 0 
        ? Math.max(...collectionItems.map(item => item.display_order || 0)) + 1 
        : 0;
      
      const { data, error } = await supabase
        .from('collection_items')
        .insert([{
          collection_id: selectedCollection,
          image_url: newItem.image_url,
          label: newItem.label,
          description: newItem.description || null,
          animation_type: newItem.animation_type,
          display_order: nextOrder
        }])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Item added successfully",
      });
      
      setNewItem({
        image_url: "",
        label: "",
        description: "",
        animation_type: "scale",
        display_order: 0
      });
      resetImageProcessing();
      setIsAddingItem(false);
      fetchCollectionItems(selectedCollection);
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
    }
  };
  
  // Update an existing item
  const handleUpdateItem = async (item: CollectionItem) => {
    try {
      const { error } = await supabase
        .from('collection_items')
        .update({
          image_url: item.image_url,
          label: item.label,
          description: item.description,
          animation_type: item.animation_type,
          display_order: item.display_order
        })
        .eq('id', item.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      
      setEditingItem(null);
      resetImageProcessing();
      if (selectedCollection) {
        fetchCollectionItems(selectedCollection);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };
  
  // Delete an item
  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('collection_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      
      if (selectedCollection) {
        fetchCollectionItems(selectedCollection);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };
  
  // Handle collection change
  const handleCollectionChange = (collectionId: string) => {
    setSelectedCollection(collectionId);
    fetchCollectionItems(collectionId);
  };
  
  // Image preview component
  const ImagePreview = ({ src, alt = "Image preview" }: { src: string, alt?: string }) => {
    const isProcessed = src === processedImageUrl;
    const isBeingProcessed = src === imageToProcess && isProcessingImage;
    
    return (
      <div className="relative h-40 w-full border rounded-md overflow-hidden">
        {isBeingProcessed ? (
          <div className="h-full w-full flex items-center justify-center bg-secondary/20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <img 
              src={src} 
              alt={alt} 
              className="h-full w-full object-contain"
            />
            {isProcessed && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs rounded-full px-2 py-1">
                Background Removed
              </div>
            )}
          </>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Collection Manager</h2>
        <Button onClick={() => setIsAddingCollection(!isAddingCollection)} variant="outline">
          {isAddingCollection ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {isAddingCollection ? "Cancel" : "New Collection"}
        </Button>
      </div>
      
      {isAddingCollection && (
        <Card>
          <CardHeader>
            <CardTitle>New Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input
                  value={newCollection.name}
                  onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Collection name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description (optional)</label>
                <Textarea
                  value={newCollection.description}
                  onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Collection description"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddingCollection(false)}>Cancel</Button>
            <Button onClick={handleAddCollection}>Create Collection</Button>
          </CardFooter>
        </Card>
      )}
      
      {collections.length > 0 ? (
        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="items">Collection Items</TabsTrigger>
            <TabsTrigger value="collections">Manage Collections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="items" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="w-1/3">
                <label className="text-sm font-medium mb-1 block">Select Collection</label>
                <Select
                  value={selectedCollection || ""}
                  onValueChange={handleCollectionChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map(collection => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedCollection && (
                <Button onClick={() => setIsAddingItem(!isAddingItem)} variant="outline">
                  {isAddingItem ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {isAddingItem ? "Cancel" : "Add Item"}
                </Button>
              )}
            </div>
            
            {selectedCollection && isAddingItem && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Image URL</label>
                      <div className="flex gap-2">
                        <Input
                          value={newItem.image_url}
                          onChange={(e) => {
                            if (processedImageUrl && e.target.value !== processedImageUrl) {
                              resetImageProcessing();
                            }
                            setNewItem(prev => ({ ...prev, image_url: e.target.value }));
                          }}
                          placeholder="https://example.com/image.jpg"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => handleRemoveBackground(newItem.image_url)}
                          disabled={!newItem.image_url || isProcessingImage}
                          title="Remove Background"
                          className="shrink-0"
                        >
                          <ImageOff className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {newItem.image_url && (
                      <div>
                        <label className="text-sm font-medium mb-1 block">Image Preview</label>
                        <ImagePreview src={newItem.image_url} />
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Label</label>
                      <Input
                        value={newItem.label}
                        onChange={(e) => setNewItem(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Item label"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Description (optional)</label>
                      <Textarea
                        value={newItem.description}
                        onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Item description"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Animation Type</label>
                      <Select
                        value={newItem.animation_type}
                        onValueChange={(value) => setNewItem(prev => ({ ...prev, animation_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select animation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scale">Scale</SelectItem>
                          <SelectItem value="move">Move</SelectItem>
                          <SelectItem value="fade">Fade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsAddingItem(false);
                    resetImageProcessing();
                  }}>Cancel</Button>
                  <Button onClick={handleAddItem}>Add Item</Button>
                </CardFooter>
              </Card>
            )}
            
            {selectedCollection && (
              <div>
                {isLoading ? (
                  <div className="text-center py-8">Loading items...</div>
                ) : collectionItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No items in this collection. Add some items to get started.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collectionItems.map(item => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${item.image_url})` }} />
                        <CardContent className="p-4">
                          <h3 className="font-medium text-lg mb-1">{item.label}</h3>
                          {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                          <p className="mt-2 text-xs text-muted-foreground">Animation: {item.animation_type || 'None'}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t pt-3">
                          <Button variant="outline" size="sm" onClick={() => setEditingItem(item.id)}>
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </CardFooter>
                        
                        {/* Edit Modal (could be replaced with a Dialog component) */}
                        {editingItem === item.id && (
                          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                            <Card className="w-full max-w-md">
                              <CardHeader>
                                <CardTitle>Edit Item</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium mb-1 block">Image URL</label>
                                    <div className="flex gap-2">
                                      <Input
                                        value={item.image_url}
                                        onChange={(e) => {
                                          if (processedImageUrl && e.target.value !== processedImageUrl) {
                                            resetImageProcessing();
                                          }
                                          setCollectionItems(prev => 
                                            prev.map(i => i.id === item.id ? {...i, image_url: e.target.value} : i)
                                          );
                                        }}
                                        placeholder="https://example.com/image.jpg"
                                      />
                                      <Button 
                                        variant="outline" 
                                        onClick={() => handleRemoveBackground(item.image_url, false)}
                                        disabled={!item.image_url || isProcessingImage}
                                        title="Remove Background"
                                        className="shrink-0"
                                      >
                                        <ImageOff className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  {item.image_url && (
                                    <div>
                                      <label className="text-sm font-medium mb-1 block">Image Preview</label>
                                      <ImagePreview src={item.image_url} />
                                    </div>
                                  )}
                                  
                                  <div>
                                    <label className="text-sm font-medium mb-1 block">Label</label>
                                    <Input
                                      value={item.label}
                                      onChange={(e) => setCollectionItems(prev => 
                                        prev.map(i => i.id === item.id ? {...i, label: e.target.value} : i)
                                      )}
                                      placeholder="Item label"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-1 block">Description (optional)</label>
                                    <Textarea
                                      value={item.description || ""}
                                      onChange={(e) => setCollectionItems(prev => 
                                        prev.map(i => i.id === item.id ? {...i, description: e.target.value} : i)
                                      )}
                                      placeholder="Item description"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-1 block">Animation Type</label>
                                    <Select
                                      value={item.animation_type || "scale"}
                                      onValueChange={(value) => setCollectionItems(prev => 
                                        prev.map(i => i.id === item.id ? {...i, animation_type: value} : i)
                                      )}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select animation type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="scale">Scale</SelectItem>
                                        <SelectItem value="move">Move</SelectItem>
                                        <SelectItem value="fade">Fade</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-1 block">Display Order</label>
                                    <Input
                                      type="number"
                                      value={item.display_order || 0}
                                      onChange={(e) => setCollectionItems(prev => 
                                        prev.map(i => i.id === item.id ? {...i, display_order: parseInt(e.target.value)} : i)
                                      )}
                                    />
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => {
                                  setEditingItem(null);
                                  resetImageProcessing();
                                }}>Cancel</Button>
                                <Button onClick={() => handleUpdateItem(item)}>Save Changes</Button>
                              </CardFooter>
                            </Card>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="collections" className="space-y-6">
            {collections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No collections yet. Create a collection to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map(collection => (
                  <Card key={collection.id}>
                    <CardHeader>
                      <CardTitle>{collection.name}</CardTitle>
                      {collection.description && (
                        <CardDescription>{collection.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleCollectionChange(collection.id)}>
                        View Items
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCollection(collection.id)}>
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : isLoading ? (
        <div className="text-center py-8">Loading collections...</div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No collections yet. Create a collection to get started.
        </div>
      )}
    </div>
  );
};

export default CollectionManager;
