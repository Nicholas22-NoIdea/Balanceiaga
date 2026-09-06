"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Plus, CheckSquare, Clock } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Calendar, label: "Schedule", href: "/capacity" },
  { icon: Plus, label: "", href: "/add-workload", isCenter: true },
  { icon: CheckSquare, label: "Tasks", href: "/overload" },
  { icon: Clock, label: "History", href: "/" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) =>
        item.isCenter ? (
          <Link
            key={item.href + "-center"}
            href={item.href}
            className="flex items-center justify-center w-14 h-14 rounded-full -mt-6 shadow-lg"
            style={{ background: "#6C63FF" }}
          >
            <Plus color="white" size={28} />
          </Link>
        ) : (
          <Link
            key={item.href + item.label}
            href={item.href}
            className="flex flex-col items-center gap-1"
          >
            <item.icon
              size={22}
              color={pathname === item.href ? "#6C63FF" : "#B0B3D6"}
            />
            <span
              className="text-xs font-medium"
              style={{ color: pathname === item.href ? "#6C63FF" : "#B0B3D6" }}
            >
              {item.label}
            </span>
          </Link>
        )
      )}
    </nav>
  );
}
