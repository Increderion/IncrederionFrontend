import { createContext, useState, useEffect, type ReactNode } from "react";

export const AuthContext = createContext<{
  loggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem("sb-access-token"));

  useEffect(() => {
    const handleStorage = () => setLoggedIn(!!localStorage.getItem("sb-access-token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>{children}</AuthContext.Provider>;
}