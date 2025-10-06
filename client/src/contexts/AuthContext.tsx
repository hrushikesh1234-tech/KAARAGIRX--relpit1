import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User, LoginCredentials, RegisterData } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage key for user data
const USER_STORAGE_KEY = 'kamshet_build_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      console.log("AuthContext: Attempting login with credentials:", credentials.email);
      
      // Always use backend authentication
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      console.log("AuthContext: Login API response received");
      const userData = await res.json();
      console.log("AuthContext: User data received:", userData);
      
      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.fullName}!`,
      });
      
      // Redirect based on user type
      if (userData.userType === 'contractor') {
        // Redirect contractors to their profile dashboard
        navigate("/profile-dashboard");
        console.log('Redirecting to contractor profile dashboard');
      } else if (userData.userType === 'architect') {
        // Redirect architects to their profile dashboard
        navigate("/profile-dashboard");
        console.log('Redirecting to architect profile dashboard');
      } else if (userData.userType === 'material_dealer') {
        // Redirect material dealers to their dedicated dashboard
        navigate("/dealer/dashboard");
        console.log('Redirecting to material dealer dashboard');
      } else if (userData.userType === 'rental_merchant') {
        // Redirect rental merchants to their dedicated dashboard
        navigate("/rental/dashboard");
        console.log('Redirecting to rental merchant dashboard');
      } else if (userData.userType === 'customer') {
        // Redirect customers to their dashboard
        navigate("/customer/dashboard");
        console.log('Redirecting to customer dashboard');
      } else {
        // Default to homepage
        navigate("/");
        console.log('Redirecting to homepage');
      }
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      throw error; // Re-throw to handle in the login form
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/register", data);
      const userData = await res.json();
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again with different credentials",
        variant: "destructive",
      });
      throw error; // Re-throw to handle in the registration form
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  const logout = useCallback(async () => {
    try {
      console.log('Logging out...');
      
      // Clear user data from state and localStorage
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // Redirect to home page
      navigate('/');
      
      // Try to call the logout API if available, but don't wait for it
      try {
        await apiRequest("POST", "/api/auth/logout", {}).catch(() => {
          // Ignore errors for the API call
          console.log('Backend logout endpoint not available - using client-side only logout');
        });
      } catch (e) {
        // Ignore errors for the API call
        console.log('Error during backend logout (can be ignored):', e);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, we still want to clear the user data
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      navigate('/');
    }
  }, [toast]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Add console log for debugging
console.log('AuthContext loaded');
