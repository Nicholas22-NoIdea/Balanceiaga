"use client";
import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";

export default function NextAuthProvider({ children }: PropsWithChildren) {
  return (
    <SessionProvider
      // Re-fetch session on window focus (optional)
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
