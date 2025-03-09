
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { requireAuth, logout } from "../utils/authUtils";
import { useToast } from "../hooks/use-toast";
import BlogPostManager from "../components/admin/BlogPostManager";
import ProjectManager from "../components/admin/ProjectManager";

const Admin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    requireAuth(() => {
      // Check URL params for editing
      const editId = searchParams.get("edit");
      const editType = searchParams.get("type");
      
      if (editId && editType === "post") {
        setActiveTab("posts");
      } else if (editId && editType === "project") {
        setActiveTab("projects");
      }
    });
  }, [searchParams]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          {/* Blog Posts Tab */}
          <TabsContent value="posts">
            <BlogPostManager />
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <ProjectManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
