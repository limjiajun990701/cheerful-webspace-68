
// Simple authentication utility for admin login

interface Admin {
  username: string;
  password: string;
}

const ADMIN_KEY = 'admin_authenticated';
const DEFAULT_ADMIN: Admin = {
  username: 'admin',
  password: 'password123'
};

// Check if admin is logged in
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(ADMIN_KEY) === 'true';
};

// Login function
export const login = (username: string, password: string): boolean => {
  // In a real app, this would make an API call to verify credentials
  if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
    localStorage.setItem(ADMIN_KEY, 'true');
    return true;
  }
  return false;
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem(ADMIN_KEY);
};

// Function to require authentication (for protected routes)
export const requireAuth = (callback: () => void): void => {
  if (!isAuthenticated()) {
    window.location.href = '/admin/login';
    return;
  }
  
  callback();
};
