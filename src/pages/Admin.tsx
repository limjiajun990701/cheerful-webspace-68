
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Save, Trash } from "lucide-react";
import AdminBlogCard from "../components/AdminBlogCard";
import AdminProjectCard from "../components/AdminProjectCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { requireAuth, logout } from "../utils/authUtils";
import { getAllBlogPosts, BlogPost, addBlogPost, updateBlogPost, deleteBlogPost } from "../utils/blogData";
import { getAllProjects, Project, addProject, updateProject, deleteProject } from "../utils/projectData";
import { useToast } from "../hooks/use-toast";

const Admin = () => {
  // Blog states
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Project states
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectImageUrl, setProjectImageUrl] = useState("");
  const [projectTags, setProjectTags] = useState("");
  const [projectLiveUrl, setProjectLiveUrl] = useState("");
  const [projectGithubUrl, setProjectGithubUrl] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    requireAuth(() => {
      loadPosts();
      loadProjects();
      
      // Check URL params for editing
      const editId = searchParams.get("edit");
      const editType = searchParams.get("type");
      
      if (editId && editType === "post") {
        const postToEdit = posts.find(post => post.id === editId);
        if (postToEdit) {
          setEditingId(editId);
          setTitle(postToEdit.title);
          setContent(postToEdit.content);
          setImageUrl(postToEdit.imageUrl || "");
          setTags(postToEdit.tags.join(", "));
          setActiveTab("editor");
        }
      } else if (editId && editType === "project") {
        const projectToEdit = projects.find(project => project.id === editId);
        if (projectToEdit) {
          setEditingProjectId(editId);
          setProjectTitle(projectToEdit.title);
          setProjectDescription(projectToEdit.description);
          setProjectImageUrl(projectToEdit.imageUrl || "");
          setProjectTags(projectToEdit.tags.join(", "));
          setProjectLiveUrl(projectToEdit.liveUrl || "");
          setProjectGithubUrl(projectToEdit.githubUrl || "");
          setActiveTab("project-editor");
        }
      }
    });
  }, [searchParams, posts, projects]);

  const loadPosts = async () => {
    try {
      const allPosts = await getAllBlogPosts();
      setPosts(allPosts);
    } catch (error) {
      toast({
        title: "Error Loading Posts",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadProjects = async () => {
    try {
      const allProjects = await getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      toast({
        title: "Error Loading Projects",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Blog post handlers
  const handleEditPost = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setImageUrl(post.imageUrl || "");
    setTags(post.tags.join(", "));
    setActiveTab("editor");
  };

  const handleSavePost = async () => {
    if (!title || !content) {
      toast({
        title: "Missing Fields",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const tagArray = tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

      // Create an excerpt from the content
      const excerpt = content.substring(0, 150) + (content.length > 150 ? '...' : '');
      
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (editingId) {
        // Update existing post
        await updateBlogPost({
          id: editingId,
          title,
          content,
          imageUrl: imageUrl || undefined,
          tags: tagArray,
          date,
          excerpt
        });
        
        toast({
          title: "Success",
          description: "Blog post updated successfully!",
        });
      } else {
        // Create new post
        await addBlogPost({
          title,
          content,
          imageUrl: imageUrl || undefined,
          tags: tagArray,
          date,
          excerpt
        });
        
        toast({
          title: "Success",
          description: "New blog post created successfully!",
        });
      }

      // Reset form and reload posts
      resetPostForm();
      loadPosts();
      setActiveTab("posts");
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: "Failed to save the blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteBlogPost(id);
      toast({
        title: "Success",
        description: "Blog post deleted successfully!",
      });
      loadPosts();
      
      if (editingId === id) {
        resetPostForm();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetPostForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setImageUrl("");
    setTags("");
  };

  // Project handlers
  const handleEditProject = (project: Project) => {
    setEditingProjectId(project.id);
    setProjectTitle(project.title);
    setProjectDescription(project.description);
    setProjectImageUrl(project.imageUrl || "");
    setProjectTags(project.tags.join(", "));
    setProjectLiveUrl(project.liveUrl || "");
    setProjectGithubUrl(project.githubUrl || "");
    setActiveTab("project-editor");
  };

  const handleSaveProject = async () => {
    if (!projectTitle || !projectDescription) {
      toast({
        title: "Missing Fields",
        description: "Title and description are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const tagArray = projectTags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

      if (editingProjectId) {
        // Update existing project
        await updateProject({
          id: editingProjectId,
          title: projectTitle,
          description: projectDescription,
          imageUrl: projectImageUrl || undefined,
          tags: tagArray,
          liveUrl: projectLiveUrl || undefined,
          githubUrl: projectGithubUrl || undefined
        });
        
        toast({
          title: "Success",
          description: "Project updated successfully!",
        });
      } else {
        // Create new project
        await addProject({
          title: projectTitle,
          description: projectDescription,
          imageUrl: projectImageUrl || undefined,
          tags: tagArray,
          liveUrl: projectLiveUrl || undefined,
          githubUrl: projectGithubUrl || undefined
        });
        
        toast({
          title: "Success",
          description: "New project created successfully!",
        });
      }

      // Reset form and reload projects
      resetProjectForm();
      loadProjects();
      setActiveTab("projects");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
      loadProjects();
      
      if (editingProjectId === id) {
        resetProjectForm();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectTitle("");
    setProjectDescription("");
    setProjectImageUrl("");
    setProjectTags("");
    setProjectLiveUrl("");
    setProjectGithubUrl("");
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
            <TabsTrigger value="editor">{editingId ? "Edit Post" : "New Post"}</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="project-editor">{editingProjectId ? "Edit Project" : "New Project"}</TabsTrigger>
          </TabsList>

          {/* Blog Posts Tab */}
          <TabsContent value="posts">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">All Posts</h2>
              <Button onClick={() => {
                resetPostForm();
                setActiveTab("editor");
              }}>
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </div>

            {posts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No blog posts found. Create your first post!</p>
            ) : (
              <div className="grid gap-6">
                {posts.map((post) => (
                  <AdminBlogCard
                    key={post.id}
                    post={post}
                    onEdit={() => handleEditPost(post)}
                    onDelete={() => handleDeletePost(post.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Blog Editor Tab */}
          <TabsContent value="editor">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                      Post Title *
                    </label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter post title"
                    />
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium mb-1">
                      Content *
                    </label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your post content here (Markdown supported)"
                      className="min-h-[300px]"
                    />
                  </div>

                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                      Image URL (optional)
                    </label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Enter image URL"
                    />
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium mb-1">
                      Tags (comma separated)
                    </label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g. technology, design, react"
                    />
                  </div>

                  <div className="flex gap-4 justify-end pt-4">
                    {editingId && (
                      <Button variant="outline" onClick={() => {
                        resetPostForm();
                        setActiveTab("posts");
                      }}>
                        Cancel
                      </Button>
                    )}
                    <Button onClick={handleSavePost}>
                      <Save className="mr-2 h-4 w-4" />
                      {editingId ? "Update" : "Publish"} Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">All Projects</h2>
              <Button onClick={() => {
                resetProjectForm();
                setActiveTab("project-editor");
              }}>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>

            {projects.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No projects found. Create your first project!</p>
            ) : (
              <div className="grid gap-6">
                {projects.map((project) => (
                  <AdminProjectCard
                    key={project.id}
                    project={project}
                    onEdit={() => handleEditProject(project)}
                    onDelete={() => handleDeleteProject(project.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Project Editor Tab */}
          <TabsContent value="project-editor">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="projectTitle" className="block text-sm font-medium mb-1">
                      Project Title *
                    </label>
                    <Input
                      id="projectTitle"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="Enter project title"
                    />
                  </div>

                  <div>
                    <label htmlFor="projectDescription" className="block text-sm font-medium mb-1">
                      Description *
                    </label>
                    <Textarea
                      id="projectDescription"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Write your project description"
                      className="min-h-[150px]"
                    />
                  </div>

                  <div>
                    <label htmlFor="projectImageUrl" className="block text-sm font-medium mb-1">
                      Image URL (optional)
                    </label>
                    <Input
                      id="projectImageUrl"
                      value={projectImageUrl}
                      onChange={(e) => setProjectImageUrl(e.target.value)}
                      placeholder="Enter image URL"
                    />
                  </div>

                  <div>
                    <label htmlFor="projectTags" className="block text-sm font-medium mb-1">
                      Tags (comma separated)
                    </label>
                    <Input
                      id="projectTags"
                      value={projectTags}
                      onChange={(e) => setProjectTags(e.target.value)}
                      placeholder="e.g. React, TypeScript, UI/UX"
                    />
                  </div>

                  <div>
                    <label htmlFor="projectLiveUrl" className="block text-sm font-medium mb-1">
                      Live Demo URL (optional)
                    </label>
                    <Input
                      id="projectLiveUrl"
                      value={projectLiveUrl}
                      onChange={(e) => setProjectLiveUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="projectGithubUrl" className="block text-sm font-medium mb-1">
                      GitHub URL (optional)
                    </label>
                    <Input
                      id="projectGithubUrl"
                      value={projectGithubUrl}
                      onChange={(e) => setProjectGithubUrl(e.target.value)}
                      placeholder="https://github.com/username/repo"
                    />
                  </div>

                  <div className="flex gap-4 justify-end pt-4">
                    {editingProjectId && (
                      <Button variant="outline" onClick={() => {
                        resetProjectForm();
                        setActiveTab("projects");
                      }}>
                        Cancel
                      </Button>
                    )}
                    <Button onClick={handleSaveProject}>
                      <Save className="mr-2 h-4 w-4" />
                      {editingProjectId ? "Update" : "Create"} Project
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
