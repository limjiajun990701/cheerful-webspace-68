
import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import { login, isAuthenticated } from "../utils/authUtils";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if already authenticated
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        navigate("/admin");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
          variant: "default",
        });
        navigate("/admin");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="bg-background rounded-xl p-8 shadow-sm border border-border w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access the admin dashboard
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium block">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 w-full rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-2.5"
                placeholder="admin"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium block">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-2.5"
                placeholder="password123"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Default credentials: admin / password123
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
