
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CheatSheetGallery from "@/components/cheatsheets/CheatSheetGallery";
import CheatSheetEditor from "@/components/cheatsheets/CheatSheetEditor";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const CheatSheets = () => {
  const { isLoggedIn, username } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = isLoggedIn && username === "admin"; // Simple admin check based on username
  
  // Get the active tab from URL params or default to "browse"
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get("tab") || "browse";

  // Get the cheatsheet ID if provided for viewing specific cheatsheet
  const cheatsheetId = searchParams.get("id");

  // Set URL parameter when tab changes
  const handleTabChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tab", value);
    navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
  };

  // If user is not admin and tries to access the create tab, redirect to browse
  useEffect(() => {
    if (!isAdmin && defaultTab === "create") {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("tab", "browse");
      navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
    }
  }, [isAdmin, defaultTab, navigate, location.pathname, searchParams]);

  return (
    <div className="container py-6 md:py-10 max-w-7xl mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Cheat Sheets</h1>
          <p className="text-muted-foreground">
            Access and manage programming cheat sheets for various languages and technologies.
            {isAdmin && " As an admin, you can create and edit cheat sheets."}
          </p>
        </div>
        
        <Separator className="my-6" />
        
        <Tabs value={defaultTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            {isAdmin && <TabsTrigger value="create">Create & Edit</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="browse" className="space-y-8">
            <CheatSheetGallery isAdmin={isAdmin} selectedSheetId={cheatsheetId} />
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="create" className="space-y-8">
              <CheatSheetEditor />
            </TabsContent>
          )}
          
          {!isAdmin && defaultTab === "create" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                Only administrators can create and edit cheat sheets.
              </AlertDescription>
            </Alert>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default CheatSheets;
