import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, LogIn, AlertCircle, Info } from "lucide-react";
import { login, isAuthenticated } from "../utils/authUtils";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "admin",
      password: "Admin123!",
    },
  });

  useEffect(() => {
    // Check if already authenticated
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (authenticated) {
          navigate("/admin");
        }
      } catch (err) {
        console.error("Auth check error:", err);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    setLoginAttempts(prev => prev + 1);
    
    try {
      console.log("Starting login process with:", values.username);
      const success = await login(values.username, values.password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
          variant: "default",
        });
        navigate("/admin");
      } else {
        setError("Login failed. Please make sure you're using the correct credentials.");
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
        console.log("Login failed for user:", values.username);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(`An error occurred: ${error.message || "Unknown error"}`);
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="text-center mb-6">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Admin Portal</h1>
            <p className="text-muted-foreground mt-2">Sign in to manage your portfolio content</p>
          </div>
          
          {loginAttempts >= 2 && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-700">
                <strong>Login Tip:</strong> Use exactly username: "admin" and password: "Admin123!" 
                (ensure you're using the correct exclamation mark).
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                </div>
              )}
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-foreground">Username</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          className="pl-10"
                          placeholder="admin"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-foreground">Password</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          className="pl-10"
                          placeholder="••••••••"
                        />
                      </FormControl>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      Default credentials: admin / Admin123!
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 text-base"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
