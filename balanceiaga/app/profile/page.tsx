"use client";
import Link from "next/link";
import { User, Lock, Bell, Globe, FileText, Sun, Calendar, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNotifications } from "@/lib/notificationStore";
import { useAuth } from "@/components/AuthProvider";

function SettingsItem({ icon: Icon, label, value, href, onClick, showBadge = false }: { icon: any, label: string, value?: string, href?: string, onClick?: () => void, showBadge?: boolean }) {
  const { unreadCount } = useNotifications();

  const content = (
    <>
      <div className="flex items-center" style={{ gap: "16px" }}>
        <Icon size={20} color="#1A1A3E" />
        <span className="text-sm font-bold" style={{ color: "#1A1A3E" }}>{label}</span>
      </div>
      <div className="flex items-center" style={{ gap: "12px" }}>
        {showBadge && unreadCount > 0 && (
          <div className="rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ padding: "2px 8px", background: "#FF4444" }}>
            {unreadCount}
          </div>
        )}
        {value && (
          <span className="text-xs font-medium" style={{ color: "#8B8FB5" }}>{value}</span>
        )}
        <ChevronRight size={16} color="#8B8FB5" />
      </div>
    </>
  );

  const className = "flex items-center justify-between bg-white active:bg-gray-50 transition-colors first:rounded-t-3xl last:rounded-b-3xl w-full text-left";
  const style = { padding: "16px", borderBottom: "1px solid #E8E9FF" };

  if (onClick) {
    return (
      <button onClick={onClick} className={className} style={style}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href || "#"} className={className} style={style}>
      {content}
    </Link>
  );
}

export default function ProfilePage() {
  const { logout } = useAuth();

  return (
    <>
      <div className="screen" style={{ padding: "24px 16px 120px 16px", background: "#F0F1FF" }}>
        
        {/* Header */}
        <div className="text-center mb-6 mt-2">
          <h1 className="text-lg font-black" style={{ color: "#1A1A3E" }}>Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl flex items-center" style={{ marginBottom: "32px", padding: "20px", gap: "16px", background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #6C63FF 0%, #A78BFA 100%)" }}
          >
            AM
          </div>
          <div>
            <p className="text-lg font-bold" style={{ color: "#1A1A3E" }}>Andrew Mike</p>
            <p className="text-sm font-medium" style={{ color: "#8B8FB5" }}>andrew.mike@university.edu</p>
          </div>
        </div>

        {/* Account Section */}
        <div style={{ marginBottom: "32px" }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ padding: "0 16px", color: "#8B8FB5", marginBottom: "12px" }}>Account</p>
          <div className="rounded-3xl flex flex-col" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.03)", background: "white" }}>
            <SettingsItem icon={User} label="Manage Profile" />
            <SettingsItem icon={Lock} label="Password & Security" />
            <SettingsItem icon={Bell} label="Notifications" href="/notifications" showBadge={true} />
            <SettingsItem icon={Globe} label="Language" value="English" />
          </div>
        </div>

        {/* Preferences Section */}
        <div style={{ marginBottom: "32px" }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ padding: "0 16px", color: "#8B8FB5", marginBottom: "12px" }}>Preferences</p>
          <div className="rounded-3xl flex flex-col" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.03)", background: "white" }}>
            <SettingsItem icon={FileText} label="About Us" />
            <SettingsItem icon={Sun} label="Theme" value="Light" />
            <SettingsItem icon={Calendar} label="Appointments" />
          </div>
        </div>

        {/* Support Section */}
        <div style={{ marginBottom: "32px" }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ padding: "0 16px", color: "#8B8FB5", marginBottom: "12px" }}>Support</p>
          <div className="rounded-3xl flex flex-col" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.03)", background: "white" }}>
            <SettingsItem icon={HelpCircle} label="Help Center" />
            <SettingsItem icon={LogOut} label="Log Out" onClick={logout} />
          </div>
        </div>

      </div>
      <BottomNav />
    </>
  );
}
