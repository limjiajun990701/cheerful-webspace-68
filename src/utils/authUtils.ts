
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

    // If login failed, check if it's because the account doesn't exist
    if (error) {
      console.log("Login failed, attempting to create admin account");
      
      // If the admin doesn't exist yet, create it (only for specific credentials)
      if (username === "admin" && password === "Admin123!") {
        console.log("Creating new admin account");
        
        // First, check if the email is already registered but not confirmed
        const { data: userExists } = await supabase.auth.admin.listUsers();
        const adminExists = userExists?.users?.some(user => user.email === adminEmail);
        
        if (adminExists) {
          // Try admin sign-in directly (bypassing email verification)
          const { data: adminSignIn, error: adminSignInError } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: password
          });
          
          if (!adminSignInError) {
            console.log("Admin login successful");
            return true;
          }
        }
        
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
        
        // For development purposes, we'll auto-confirm the email
        try {
          console.log("Admin account created, signing in");
          
          // Try to sign in directly after creation
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: password,
          });
          
          if (loginError) {
            console.error("Login after signup failed:", loginError);
            return false;
          }
          
          console.log("Login successful after signup");
          return true;
        } catch (err) {
          console.error("Error during auto-confirmation:", err);
          return false;
        }
      }
      
      // If not using the default credentials, login fails
      console.error("Invalid credentials:", error.message);
      return false;
    }
    
    console.log("Login successful");
    return true;
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
