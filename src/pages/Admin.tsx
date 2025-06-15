import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeManager from "@/components/admin/HomeManager";
import AboutWhoAmIManager from "@/components/admin/AboutWhoAmIManager";
import AboutHeroManager from "@/components/admin/AboutHeroManager";

const Admin = () => {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      <Tabs defaultValue="home">
        <TabsList>
          <TabsTrigger value="home">Home Page</TabsTrigger>
          <TabsTrigger value="about">About - Who Am I?</TabsTrigger>
          <TabsTrigger value="about-hero">About Hero Section</TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          <HomeManager />
        </TabsContent>
        <TabsContent value="about">
          <AboutWhoAmIManager />
        </TabsContent>
        <TabsContent value="about-hero">
          <AboutHeroManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
