
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { isAuthenticated, logout } from "../utils/authUtils";
import { useToast } from "../hooks/use-toast";
import BlogPostManager from "../components/admin/BlogPostManager";
import ProjectManager from "../components/admin/ProjectManager";
import CertificationManager from "../components/admin/CertificationManager";
import ResumeManager from "../components/admin/ResumeManager";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("posts");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          navigate("/admin/login");
          return;
        }
        setIsAuthenticated(true);
        
        // Check URL params for editing
        const editId = searchParams.get("edit");
        const editType = searchParams.get("type");
        
        if (editId && editType === "post") {
          setActiveTab("posts");
        } else if (editId && editType === "project") {
          setActiveTab("projects");
        } else if (editId && editType === "certification") {
          setActiveTab("certifications");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        navigate("/admin/login");
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate("/admin/login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [searchParams, navigate]);

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
      variant: "default",
    });
    navigate("/admin/login");
  };

  if (!isAuthenticated) {
    return null; // Don't render anything until authentication check is complete
  }

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
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
          </TabsList>

          {/* Blog Posts Tab */}
          <TabsContent value="posts">
            <BlogPostManager />
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <ProjectManager />
          </TabsContent>
          
          {/* Certifications Tab */}
          <TabsContent value="certifications">
            <CertificationManager />
          </TabsContent>

          {/* Resume Tab */}
          <TabsContent value="resume">
            <ResumeManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
