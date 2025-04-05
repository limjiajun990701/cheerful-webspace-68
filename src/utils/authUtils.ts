
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
      .select('username')
      .eq('username', username)
      .single();
    
    if (adminError || !adminUser) {
      console.error("Admin user not found:", adminError);
      return false;
    }

    // Then authenticate with Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: `${username}@example.com`, // Using username as email for Supabase auth
      password: password,
    });

    if (error) {
      console.error("Login error:", error);
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
