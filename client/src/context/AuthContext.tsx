import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  User, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  auth, 
  registerUser, 
  loginUser, 
  logoutUser, 
  resetPassword, 
  getUserData 
} from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

// Define the shape of our authentication context
interface AuthContextType {
  currentUser: User | null;
  userData: any;
  loading: boolean;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetUserPassword: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  authModalView: "login" | "register" | "forgotPassword";
  setAuthModalView: (view: "login" | "register" | "forgotPassword") => void;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  resetUserPassword: async () => {},
  refreshUserData: async () => {},
  isAuthModalOpen: false,
  setIsAuthModalOpen: () => {},
  authModalView: "login",
  setAuthModalView: () => {},
});

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "register" | "forgotPassword">("login");
  
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshUserData = async () => {
    if (currentUser) {
      try {
        const data = await getUserData(currentUser.uid);
        setUserData(data);
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      await registerUser(email, password, displayName);
      toast({
        title: "Account created successfully!",
        description: "Please check your email for verification link.",
      });
      setIsAuthModalOpen(false);
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
      throw new Error(error.message);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await loginUser(email, password);
      toast({
        title: "Login successful!",
        description: "Welcome back to DocDot.",
      });
      setIsAuthModalOpen(false);
      await refreshUserData();
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logged out successfully",
        description: "Come back soon!",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
      throw new Error(error.message);
    }
  };

  const resetUserPassword = async (email: string) => {
    try {
      await resetPassword(email);
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions.",
      });
      setAuthModalView("login");
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive"
      });
      throw new Error(error.message);
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    register,
    login,
    logout,
    resetUserPassword,
    refreshUserData,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalView,
    setAuthModalView
  };

  return <AuthContext.Provider value={value}>{!loading ? children : null}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
