"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Plus, Leaf, User } from "lucide-react";
import { useNotifications } from "@/lib/notificationStore";

const baseNavItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Calendar, label: "Schedule", href: "/capacity" },
  { icon: Plus, label: "", href: "/add-workload", isCenter: true },
  { icon: Leaf, label: "Recovery", href: "/recovery" },
  { icon: User, label: "Profile", href: "/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  const navItems = baseNavItems.map(item => 
    item.label === "Profile" && unreadCount > 0 ? { ...item, badge: unreadCount } : item
  );

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
            className="flex flex-col items-center gap-1 relative"
          >
            <div className="relative">
              <item.icon
                size={22}
                color={pathname === item.href || pathname.startsWith(item.href + "/") ? "#6C63FF" : "#B0B3D6"}
              />
              {"badge" in item && item.badge ? (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
                  style={{ background: "#FF4444", fontSize: "9px", fontWeight: 700 }}>
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span
              className="text-xs font-medium"
              style={{ color: pathname === item.href || pathname.startsWith(item.href + "/") ? "#6C63FF" : "#B0B3D6" }}
            >
              {item.label}
            </span>
          </Link>
        )
      )}
    </nav>
  );
}
