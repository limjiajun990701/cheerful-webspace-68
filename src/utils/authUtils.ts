
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

// Login function
export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    console.log("Attempting login with username:", username);
    
    // Use a valid email format with domain
    const adminEmail = `admin@portfolio.com`;
    
    // Sign in with Supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      
      // If the admin hasn't been created yet and the username is "admin", create it
      if (username === "admin" && password === "Admin123!") {
        console.log("Admin not found, creating new admin account");
        
        // Create the admin user in Supabase Auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: adminEmail,
          password: password,
        });
        
        if (signUpError) {
          console.error("Admin account creation failed:", signUpError);
          return false;
        }
        
        console.log("Admin account created, signing in again");
        
        // Sign in with the newly created account
        const { error: secondLoginError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: password,
        });
        
        if (secondLoginError) {
          console.error("Second login attempt failed:", secondLoginError);
          return false;
        }
        
        return true;
      } else {
        return false;
      }
    }
    
    console.log("Login successful");
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
