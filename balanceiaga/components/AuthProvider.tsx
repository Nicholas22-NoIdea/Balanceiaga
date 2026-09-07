"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedAuth = localStorage.getItem("balanceiaga_auth");
    if (storedAuth === "true") {
      setIsLoggedIn(true);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn && pathname !== "/login") {
      router.replace("/login");
    }
  }, [mounted, isLoggedIn, pathname, router]);

  const login = () => {
    localStorage.setItem("balanceiaga_auth", "true");
    setIsLoggedIn(true);
  };

  if (!mounted) {
    return <div style={{ background: "#F4F6FA", minHeight: "100vh", width: "100%" }} />;
  }

  // Prevent flashing protected content before redirect
  if (!isLoggedIn && pathname !== "/login") {
    return <div style={{ background: "#F4F6FA", minHeight: "100vh", width: "100%" }} />;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
