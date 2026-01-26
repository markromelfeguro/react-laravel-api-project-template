import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AuthService from "../api/AuthService";

interface AuthContextProps {
  user: any;
  login: (login_credential: string, password: string, remember_me: boolean) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
  loading: boolean;
  justLoggedOut: boolean;
  setJustLoggedOut: (value: boolean) => void;
  hasPermission: (allowedRoles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  // Check user role permissions
  const hasPermission = useCallback((allowedRoles: string[]) => {
    return user && allowedRoles.includes(user.role);
  }, [user]);

  // to determine if user is logged in
  const isLoggedIn = !!user;

  // Initialize Auth Fetch current session on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = await AuthService.me();
        setUser(userData);
      } catch (error) {
        // If the cookie is invalid or missing, Laravel returns 401
        // and we ensure the user state is null
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (login_credential: string, password: string, remember_me: boolean) => {
    // AuthService.login handles both CSRF handshake and the POST request
    const response = await AuthService.login({ 
        login_credential, 
        password, 
        remember_me 
    });
    
    // On success, Laravel sends 'Set-Cookie' header
    // We simply update the local user state
    setUser(response.data.user);
    setJustLoggedOut(false);
  };

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout request failed, clearing local state anyway.");
    } finally {
      // Clear user state and cleanup
      setUser(null);
      setJustLoggedOut(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn,
        loading,
        justLoggedOut,
        setJustLoggedOut,
        hasPermission,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};