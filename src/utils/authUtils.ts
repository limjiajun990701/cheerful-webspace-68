
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Simple session management
let currentSession: { 
  id: string; 
  username: string; 
  expiresAt: number;
} | null = null;

// Check if admin is logged in
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    // Check if we have a local session and it's not expired
    if (currentSession && currentSession.expiresAt > Date.now()) {
      return true;
    }
    
    // Check if we have a session in localStorage
    const storedSession = localStorage.getItem('admin_session');
    if (storedSession) {
      const session = JSON.parse(storedSession);
      if (session && session.expiresAt > Date.now()) {
        currentSession = session;
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
};

// Login function using the custom admin_users table
export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    console.log("Attempting login with username:", username);
    
    // Query the admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('password_hash', password)
      .single();
    
    if (error) {
      console.error("Login database error:", error.message);
      
      // If the credentials are admin/Admin123!, let's create the admin user
      if (username === "admin" && password === "Admin123!") {
        console.log("Creating new admin account");
        
        // Insert admin user
        const { data: newAdmin, error: insertError } = await supabase
          .from('admin_users')
          .insert([
            { 
              username: username, 
              password_hash: password 
            }
          ])
          .select();
        
        if (insertError) {
          console.error("Admin account creation failed:", insertError);
          return false;
        }
        
        console.log("Admin account created successfully");
        
        // Create session after successful creation
        const sessionId = uuidv4();
        currentSession = {
          id: sessionId,
          username: username,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        // Store session in localStorage
        localStorage.setItem('admin_session', JSON.stringify(currentSession));
        
        // Update last login timestamp
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('username', username);
        
        return true;
      }
      
      return false;
    }
    
    // Login successful
    console.log("Login successful");
    
    // Create session
    const sessionId = uuidv4();
    currentSession = {
      id: sessionId,
      username: data.username,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    // Store session in localStorage
    localStorage.setItem('admin_session', JSON.stringify(currentSession));
    
    // Update last login timestamp
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('username', username);
    
    return true;
  } catch (error) {
    console.error("Error in login process:", error);
    return false;
  }
};

// Logout function
export const logout = async (): Promise<void> => {
  currentSession = null;
  localStorage.removeItem('admin_session');
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
  // For compatibility with existing code, return null
  // since we're not using Supabase Auth anymore
  return null;
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  // For compatibility with existing code, return null
  // since we're not using Supabase Auth anymore
  return null;
};

// Get current admin username
export const getCurrentAdmin = (): string | null => {
  if (currentSession) {
    return currentSession.username;
  }
  
  const storedSession = localStorage.getItem('admin_session');
  if (storedSession) {
    const session = JSON.parse(storedSession);
    if (session && session.expiresAt > Date.now()) {
      return session.username;
    }
  }
  
  return null;
};
