
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { isAuthenticated, logout, getCurrentAdmin } from "../utils/authUtils";
import { useToast } from "../hooks/use-toast";
import BlogPostManager from "../components/admin/BlogPostManager";
import ProjectManager from "../components/admin/ProjectManager";
import CertificationManager from "../components/admin/CertificationManager";
import ResumeManager from "../components/admin/ResumeManager";
import HomeManager from "../components/admin/HomeManager";
import AboutManager from "../components/admin/AboutManager";
import SkillsManager from "../components/admin/SkillsManager";
import ExperienceManager from "../components/admin/ExperienceManager";
import ExpertiseManager from "../components/admin/ExpertiseManager";
import { LogOut, LayoutDashboard, Settings, FileText, Award, Briefcase, User, Home, Code, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const Admin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("home");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          navigate("/admin/login");
          return;
        }
        
        // Get admin username
        const adminUsername = getCurrentAdmin();
        if (adminUsername) {
          setUsername(adminUsername);
        }
        
        setIsAuthChecked(true);
        
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
    
    // Set up interval to periodically check authentication
    const authCheckInterval = setInterval(async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated && isAuthChecked) {
        toast({
          title: "Session expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        navigate("/admin/login");
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => {
      clearInterval(authCheckInterval);
    };
  }, [searchParams, navigate, toast, isAuthChecked]);

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthChecked) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Portfolio Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <Card className="bg-primary/5 border-primary/20 px-3 py-1 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{username}</span>
            </Card>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="border-b border-border px-6 pt-4 overflow-x-auto">
              <TabsList className="grid grid-cols-9 gap-2 bg-muted/50 p-1">
                <TabsTrigger value="home" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Home Page</span>
                  <span className="sm:hidden">Home</span>
                </TabsTrigger>
                <TabsTrigger value="expertise" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Star className="h-4 w-4" />
                  <span className="hidden sm:inline">Expertise</span>
                  <span className="sm:hidden">Expert</span>
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">About Page</span>
                  <span className="sm:hidden">About</span>
                </TabsTrigger>
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
                <TabsTrigger value="skills" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Code className="h-4 w-4" />
                  <span className="hidden sm:inline">Skills</span>
                  <span className="sm:hidden">Skills</span>
                </TabsTrigger>
                <TabsTrigger value="experiences" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Experiences</span>
                  <span className="sm:hidden">Exp</span>
                </TabsTrigger>
                <TabsTrigger value="resume" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Resume</span>
                  <span className="sm:hidden">Resume</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Content panels */}
            <div className="p-6">
              <TabsContent value="home" className="mt-0 focus:outline-none">
                <HomeManager />
              </TabsContent>
              
              <TabsContent value="expertise" className="mt-0 focus:outline-none">
                <ExpertiseManager />
              </TabsContent>
              
              <TabsContent value="about" className="mt-0 focus:outline-none">
                <AboutManager />
              </TabsContent>

              <TabsContent value="posts" className="mt-0 focus:outline-none">
                <BlogPostManager />
              </TabsContent>

              <TabsContent value="projects" className="mt-0 focus:outline-none">
                <ProjectManager />
              </TabsContent>
              
              <TabsContent value="certifications" className="mt-0 focus:outline-none">
                <CertificationManager />
              </TabsContent>

              <TabsContent value="skills" className="mt-0 focus:outline-none">
                <SkillsManager />
              </TabsContent>

              <TabsContent value="experiences" className="mt-0 focus:outline-none">
                <ExperienceManager />
              </TabsContent>

              <TabsContent value="resume" className="mt-0 focus:outline-none">
                <ResumeManager />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
