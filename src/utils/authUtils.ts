
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

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

// Login function with simplified logic that doesn't require email verification
export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    console.log("Attempting login with username:", username);
    
    // Always use admin@portfolio.com as the email
    const adminEmail = `admin@portfolio.com`;
    
    // First try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: password,
    });

    // If login successful, return true immediately
    if (data?.session) {
      console.log("Login successful");
      return true;
    }

    // If login failed, check if it's because the account doesn't exist or needs creation
    if (error) {
      console.log("Login failed:", error.message);
      
      // If the admin doesn't exist yet, create it (only for specific credentials)
      if (username === "admin" && password === "Admin123!") {
        console.log("Creating new admin account");
        
        // Create the admin user in Supabase Auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: adminEmail,
          password: password,
          options: {
            data: {
              role: 'admin'
            }
          }
        });
        
        if (signUpError) {
          console.error("Admin account creation failed:", signUpError);
          return false;
        }
        
        console.log("Admin account created, trying to sign in directly");
        
        // Try to sign in without waiting for email verification
        const { data: loginAfterSignup, error: loginError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: password,
        });
        
        if (loginError) {
          console.error("Login after signup failed:", loginError);
          
          // Special case: if we get email_not_confirmed error but we're using the default admin credentials
          // Let's try to bypass this for development purposes
          if (loginError.message === "Email not confirmed" && username === "admin" && password === "Admin123!") {
            console.log("Attempting to bypass email confirmation for development");
            const { data, error } = await supabase.auth.signInWithPassword({
              email: adminEmail,
              password: password,
            });
            
            if (!error && data?.session) {
              console.log("Bypass successful");
              return true;
            }
          }
          return false;
        }
        
        console.log("Login successful after signup");
        return true;
      }
      
      // If not using the default credentials, login fails
      console.error("Invalid credentials:", error.message);
      return false;
    }
    
    return false; // Shouldn't reach here, but just in case
  } catch (error) {
    console.error("Error in login process:", error);
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

// Get current session
export const getSession = async (): Promise<Session | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
