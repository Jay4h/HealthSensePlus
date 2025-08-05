import { useState, useEffect, createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Query to get user profile if token exists
  const { data: profileData, isLoading: profileLoading, error } = useQuery({
    queryKey: ["/api/users/profile"],
    enabled: !!localStorage.getItem("token"),
    retry: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (profileData) {
      setUser(profileData);
      localStorage.setItem("user", JSON.stringify(profileData));
    } else if (error && error.message.includes("401")) {
      // Token is invalid, clear auth data
      logout();
    }
  }, [profileData, error]);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    isLoading: isLoading || profileLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
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
