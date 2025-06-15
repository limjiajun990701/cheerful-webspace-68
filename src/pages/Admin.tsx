
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeManager from "@/components/admin/HomeManager";
import AboutWhoAmIManager from "@/components/admin/AboutWhoAmIManager";
import AboutHeroManager from "@/components/admin/AboutHeroManager";
import ExperienceManager from "@/components/admin/ExperienceManager";
import ProjectManager from "@/components/admin/ProjectManager";
import CertificationManager from "@/components/admin/CertificationManager";
import BlogPostManager from "@/components/admin/BlogPostManager";
import CheatSheetManager from "@/components/admin/CheatSheetManager";
import CollectionManager from "@/components/admin/CollectionManager";

const Admin = () => {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      <Tabs defaultValue="home">
        <TabsList className="flex-wrap h-auto justify-start">
          <TabsTrigger value="home">Home Page</TabsTrigger>
          <TabsTrigger value="about-hero">About Hero</TabsTrigger>
          <TabsTrigger value="about-whoami">About - Who Am I?</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="cheatsheets">Cheat Sheets</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          <HomeManager />
        </TabsContent>
        <TabsContent value="about-hero">
          <AboutHeroManager />
        </TabsContent>
        <TabsContent value="about-whoami">
          <AboutWhoAmIManager />
        </TabsContent>
        <TabsContent value="experience">
          <ExperienceManager />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectManager />
        </TabsContent>
        <TabsContent value="certifications">
          <CertificationManager />
        </TabsContent>
        <TabsContent value="blog">
          <BlogPostManager />
        </TabsContent>
        <TabsContent value="cheatsheets">
          <CheatSheetManager />
        </TabsContent>
        <TabsContent value="collections">
          <CollectionManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
