"use client";
import { useState, useEffect } from "react";
import { Bell, Clock, AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalToast() {
  const [currentNotif, setCurrentNotif] = useState<"starting" | "ending" | "overrun" | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!window.location.pathname.includes("/notifications")) {
        setCurrentNotif("starting");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentNotif(null);
  }, [pathname]);

  const handleClose = () => {
    if (currentNotif === "starting") {
      setCurrentNotif(null);
      setTimeout(() => {
        if (!window.location.pathname.includes("/notifications")) {
          setCurrentNotif("ending");
        }
      }, 2000);
    } else if (currentNotif === "ending") {
      setCurrentNotif(null);
      setTimeout(() => {
        if (!window.location.pathname.includes("/notifications")) {
          setCurrentNotif("overrun");
        }
      }, 2000);
    } else {
      setCurrentNotif(null);
    }
  };

  if (!currentNotif) return null;

  return (
    <div className="absolute top-4 left-0 right-0 z-[999] flex justify-center px-4 pointer-events-none">
      <div 
        key={currentNotif}
        className="w-full rounded-2xl flex items-start animate-slide-down pointer-events-auto" 
        style={{ padding: "16px", background: "#F4F5F7", border: "1px solid #E5E7EB", boxShadow: "0 12px 32px rgba(0,0,0,0.12)", gap: "12px" }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: currentNotif === "starting" ? "#EEF0FF" : currentNotif === "ending" ? "#FFF3F0" : "#FFF0F0" }}>
          {currentNotif === "starting" && <Bell size={20} color="#6C63FF" />}
          {currentNotif === "ending" && <Clock size={20} color="#FF7043" />}
          {currentNotif === "overrun" && <AlertTriangle size={20} color="#FF4444" />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>
            {currentNotif === "starting" && "Task Starting Soon"}
            {currentNotif === "ending" && "Task Ending"}
            {currentNotif === "overrun" && "Overrun Detected"}
          </p>
          <p className="text-xs mt-1" style={{ color: "#8B8FB5", lineHeight: 1.5 }}>
            {currentNotif === "starting" && "\"Database Assignment\" starts in 15 minutes. Tap to view details."}
            {currentNotif === "ending" && "\"Database Assignment\" was scheduled to end now. Are you finished?"}
            {currentNotif === "overrun" && "Task is running 30 minutes over schedule. This affects recovery time."}
          </p>
          <Link href="/notifications" onClick={handleClose} className="inline-block text-xs font-bold" style={{ color: currentNotif === "starting" ? "#6C63FF" : currentNotif === "ending" ? "#FF7043" : "#FF4444", marginTop: "8px" }}>
            View Details
          </Link>
        </div>
        <button onClick={handleClose} className="flex-shrink-0" style={{ padding: "4px" }}>
          <X size={16} color="#B0B3D6" />
        </button>
      </div>
    </div>
  );
}
