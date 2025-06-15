
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CheatSheetGallery from "@/components/cheatsheets/CheatSheetGallery";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const CheatSheets = () => {
  // Only for public browsing – no admin/create tabs!
  const { isLoggedIn, username } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Read from URL for selected cheatsheet id
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = "browse"; // Always browse tab (no create/edit)
  const cheatsheetId = searchParams.get("id");

  // If someone with /cheatsheets?tab=create, redirect to browse (legacy url support)
  useEffect(() => {
    if (searchParams.get("tab") && searchParams.get("tab") !== "browse") {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("tab", "browse");
      navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
    }
  }, [navigate, location.pathname, searchParams]);

  return (
    <div className="container py-6 md:py-10 max-w-7xl mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Cheat Sheets</h1>
          <p className="text-muted-foreground">
            Access programming cheat sheets for various languages and technologies.
          </p>
        </div>
        <Separator className="my-6" />
        <Tabs value={defaultTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="browse">Browse</TabsTrigger>
          </TabsList>
          <TabsContent value="browse" className="space-y-8">
            <CheatSheetGallery isAdmin={false} selectedSheetId={cheatsheetId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CheatSheets;
