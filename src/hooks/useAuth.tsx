
import React, { useState, useEffect, createContext, useContext } from "react";
import { isAuthenticated, getCurrentAdmin, logout } from "@/utils/authUtils";

// Create a context for authentication
interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  username: null,
  logout: async () => {},
});

// Provider component that wraps the app and makes auth available
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  
  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        const adminUsername = getCurrentAdmin();
        setUsername(adminUsername);
      }
    };
    
    checkAuth();
  }, []);
  
  // Expose the logout function
  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    setUsername(null);
  };
  
  const value = {
    isLoggedIn,
    username,
    logout: handleLogout,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for components to get auth state and re-render when it changes
export const useAuth = () => {
  return useContext(AuthContext);
};
