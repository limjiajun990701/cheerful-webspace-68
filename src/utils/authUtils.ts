
import { supabase } from '@/integrations/supabase/client';

// Check if admin is logged in
export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Login function
export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    console.log("Attempting login for user:", username);
    
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

    console.log("Admin user found:", adminUser.username);

    // Construct the email using a consistent format
    const adminEmail = `${username}@admin.portfolio`;
    
    // Try to sign in with Supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      
      // If the user doesn't exist in auth yet or credentials are invalid, try to create the account
      if (error.message.includes("Invalid login credentials")) {
        console.log("Attempting to create admin auth account");
        
        // Create the user in Supabase Auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: adminEmail,
          password,
        });
        
        if (signUpError) {
          console.error("Sign up error:", signUpError);
          return false;
        }
        
        console.log("Admin account created successfully");
        
        // Try to sign in again now that the account exists
        const { data: secondLoginData, error: secondLoginError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password,
        });
        
        if (secondLoginError) {
          console.error("Second login attempt failed:", secondLoginError);
          return false;
        }
        
        console.log("Login successful after account creation");
        return true;
      }
      return false;
    }

    console.log("Login successful on first attempt");
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
