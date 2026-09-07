import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Balanceiaga",
  description: "Student workload management and rebalancing",
};

import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="phone-shell">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
