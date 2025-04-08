
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { isAuthenticated as checkAuthentication, logout } from "../utils/authUtils";
import { useToast } from "../hooks/use-toast";
import BlogPostManager from "../components/admin/BlogPostManager";
import ProjectManager from "../components/admin/ProjectManager";
import CertificationManager from "../components/admin/CertificationManager";
import ResumeManager from "../components/admin/ResumeManager";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, LayoutDashboard, Settings, FileText, Award, Briefcase } from "lucide-react";

const Admin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("posts");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const authenticated = await checkAuthentication();
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
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Portfolio Admin</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 gap-2 bg-muted/50 p-1">
              <TabsTrigger value="posts" className="flex items-center gap-2 data-[state=active]:bg-background">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Blog Posts</span>
                <span className="sm:hidden">Blog</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Projects</span>
                <span className="sm:hidden">Projects</span>
              </TabsTrigger>
              <TabsTrigger value="certifications" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Certifications</span>
                <span className="sm:hidden">Certs</span>
              </TabsTrigger>
              <TabsTrigger value="resume" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Resume</span>
                <span className="sm:hidden">Resume</span>
              </TabsTrigger>
            </TabsList>

            {/* Content panels */}
            <div className="p-1">
              <TabsContent value="posts" className="mt-0 focus:outline-none">
                <BlogPostManager />
              </TabsContent>

              <TabsContent value="projects" className="mt-0 focus:outline-none">
                <ProjectManager />
              </TabsContent>
              
              <TabsContent value="certifications" className="mt-0 focus:outline-none">
                <CertificationManager />
              </TabsContent>

              <TabsContent value="resume" className="mt-0 focus:outline-none">
                <ResumeManager />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
