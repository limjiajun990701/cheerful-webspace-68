
import { supabase } from '@/integrations/supabase/client';

// Check if admin is logged in
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
};

// Login function
export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    console.log("Attempting login with username:", username);
    
    // First check if the admin user exists in the admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('username, password_hash')
      .eq('username', username)
      .single();
    
    if (adminError || !adminUser) {
      console.error("Error fetching admin user:", adminError || "User not found");
      return false;
    }
    
    console.log("Admin user found:", adminUser.username);
    
    // Check if the password matches directly
    if (adminUser.password_hash !== password) {
      console.error("Password doesn't match");
      return false;
    }

    // Construct the email using a consistent format
    const adminEmail = `${username}@admin.portfolio`;
    
    // Try to sign in with Supabase auth
    try {
      console.log("Attempting to sign in with Supabase auth");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password,
      });

      if (error) {
        console.log("Sign in failed, creating new account:", error.message);
        
        // Create the user in Supabase Auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: adminEmail,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/admin'
          }
        });
        
        if (signUpError) {
          console.error("Sign up failed:", signUpError);
          return false;
        }
        
        console.log("Admin account created, signing in");
        
        // Sign in with the newly created account
        const { error: secondLoginError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password,
        });
        
        if (secondLoginError) {
          console.error("Second login attempt failed:", secondLoginError);
          return false;
        }
      }
      
      console.log("Login successful");
      return true;
    } catch (authError) {
      console.error("Auth operation failed:", authError);
      return false;
    }
  } catch (error) {
    console.error("Error in login:", error);
    return false;
  }
};

// Logout function
export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
};

// Function to require authentication (for protected routes)
export const requireAuth = async (callback: () => void): Promise<void> => {
  try {
    const isLoggedIn = await isAuthenticated();
    if (!isLoggedIn) {
      window.location.href = '/admin/login';
      return;
    }
    
    callback();
  } catch (error) {
    console.error("Authentication check failed:", error);
    window.location.href = '/admin/login';
  }
};
