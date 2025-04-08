
import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import { login, isAuthenticated } from "../utils/authUtils";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "admin",
      password: "admin",
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

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          navigate("/admin");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    
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
        setError("Invalid username or password. Please try again.");
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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Username</FormLabel>
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
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="pl-10"
                        placeholder="admin"
                      />
                    </FormControl>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Default credentials: admin / admin
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </div>

      <Dialog open={showPasswordReset} onOpenChange={setShowPasswordReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Please contact the system administrator to reset your password.</p>
          </div>
          <Button onClick={() => setShowPasswordReset(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLogin;
