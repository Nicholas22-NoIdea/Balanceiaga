import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Balanceiaga",
  description: "Student workload management and rebalancing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="phone-shell">
          {children}
        </div>
      </body>
    </html>
  );
}
