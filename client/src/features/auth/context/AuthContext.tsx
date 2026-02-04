import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import AuthService from "../api/AuthService";
import { notify } from "../../../utils/notify";
import AxiosInstance from "../../../api/AxiosInstance";

interface AuthContextProps {
  user: any;
  siteName: string;
  setSiteName: (name: string) => void;
  login: (login_credential: string, password: string, remember_me: boolean) => Promise<void>;
  updateUser: (updatedUser: any) => void;
  logout: () => void;
  isLoggedIn: boolean;
  loading: boolean;
  justLoggedOut: boolean;
  setJustLoggedOut: (value: boolean) => void;
  hasPermission: (allowedRoles: string[]) => boolean;
  refreshSettings: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [siteName, setSiteName] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  
  // Guard for single-toast per session loss
  const hasNotifiedError = useRef(false);

  // Unified session expiry handler
  const handleSessionExpired = useCallback(() => {
  // 1. Check if we already have a lock in this specific app session (ref)
  if (hasNotifiedError.current) return;
  
  // 2. Check if we already have a lock in this browser session (sessionStorage)
  if (sessionStorage.getItem('session_expired_toast')) return;

  // 3. Set the locks IMMEDIATELY (Atomic operation)
  hasNotifiedError.current = true;
  sessionStorage.setItem('session_expired_toast', 'true');

  // 4. Finally, trigger the notification
  notify.error("Your session has expired. Please log in again.");
}, []);

  // Unified Config Fetcher
  const refreshSettings = useCallback(async () => {
    try {
      const res = await AxiosInstance.get('/system-configs');
      const siteConfig = res.data.data.find((c: any) => c.key === 'site_name');
      if (siteConfig) setSiteName(siteConfig.value);
    } catch (error: any) {
      setSiteName("MRF Template");
      // Only notify if we haven't already
      if (error.response?.status === 401) {
        handleSessionExpired();
      }
    }
  }, [handleSessionExpired]);

  // Sequential Boot Initialization
  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        // Auth Check
        try {
          const authRes = await AuthService.me();
          if (isMounted) {
              setUser(authRes.data);
              sessionStorage.removeItem('session_expired_toast');
              hasNotifiedError.current = false;
          }
        } catch (authError: any) {
          if (isMounted) setUser(null);
          if (authError.response?.status === 401) {
            handleSessionExpired();
          }
        }

        // Settings Check
        if (isMounted) {
            await refreshSettings();
        }

      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, [handleSessionExpired, refreshSettings]);

  // Post-Reload Notification Handler
  useEffect(() => {
    const msg = sessionStorage.getItem('auth_notification');
    if (msg) {
      notify.success(msg);
      sessionStorage.removeItem('auth_notification');
    }
  }, []);

  const login = async (login_credential: string, password: string, remember_me: boolean) => {
    const response = await AuthService.login({ login_credential, password, remember_me });
    const userData = response.data.data.user;
    
    // Reset guards on successful login
    sessionStorage.removeItem('session_expired_toast');
    hasNotifiedError.current = false;

    notify.success(response.data.message);
    setUser(userData);
    setJustLoggedOut(false);
  };

  const logout = useCallback(async () => {
    try {
      const response = await AuthService.logout();
      sessionStorage.setItem('auth_notification', response.data?.message || "Successfully logged out");
    } catch (error) {
      console.error("Logout failed.");
    } finally {
      setUser(null);
      setJustLoggedOut(true);
      window.location.href = `/login`;
    }
  }, []);
  
  const updateUser = useCallback((updatedUser: any) => setUser(updatedUser), []);
  const hasPermission = useCallback((roles: string[]) => user && roles.includes(user.role), [user]);

  return (
    <AuthContext.Provider
      value={{
        user, siteName, setSiteName, login, updateUser,
        logout, isLoggedIn: !!user, loading, justLoggedOut,
        setJustLoggedOut, hasPermission, refreshSettings
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};