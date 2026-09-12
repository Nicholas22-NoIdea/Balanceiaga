import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import NextAuthProvider from "@/components/NextAuthProvider";
import GlobalToast from "@/components/GlobalToast";

export const metadata: Metadata = {
  title: "Balanceiaga",
  description: "Student workload management and rebalancing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <AuthProvider>
            <div className="phone-shell">
              <GlobalToast />
              {children}
            </div>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
