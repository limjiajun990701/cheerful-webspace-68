
import { supabase } from '@/integrations/supabase/client';

// Check if admin is logged in
export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Login function
export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    // First check if the admin user exists in the admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('username, password_hash')
      .eq('username', username)
      .single();
    
    if (adminError || !adminUser) {
      console.error("Admin user not found:", adminError);
      return false;
    }

    // Then authenticate with Supabase
    // For admin users, we'll use a special email format
    const { error } = await supabase.auth.signInWithPassword({
      email: `${username}@admin.portfolio`, // Using a consistent email format for admin authentication
      password: password,
    });

    if (error) {
      console.error("Login error:", error);
      // If the user doesn't exist in auth yet, create it
      if (error.message.includes("Email not confirmed") || 
          error.message.includes("Invalid login credentials")) {
        // Try to sign up the admin user if they don't exist yet in auth
        const { error: signUpError } = await supabase.auth.signUp({
          email: `${username}@admin.portfolio`,
          password: password,
        });
        
        if (signUpError) {
          console.error("Sign up error:", signUpError);
          return false;
        }
        
        // Try logging in again
        const { error: secondLoginError } = await supabase.auth.signInWithPassword({
          email: `${username}@admin.portfolio`,
          password: password,
        });
        
        if (secondLoginError) {
          console.error("Second login attempt failed:", secondLoginError);
          return false;
        }
        
        return true;
      }
      return false;
    }

    return true;
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
  const isLoggedIn = await isAuthenticated();
  if (!isLoggedIn) {
    window.location.href = '/admin/login';
    return;
  }
  
  callback();
};
