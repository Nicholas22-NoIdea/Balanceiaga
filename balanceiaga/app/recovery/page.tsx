"use client";
import Link from "next/link";
import { ChevronLeft, CalendarPlus } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { recoveryCatalog } from "@/lib/recoveryData";
import { useState } from "react";

export default function RecoveryHub() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  const categories = ["All", "Mind", "Body", "Fun", "Environment", "Social", "Rest"];
  const displayedActivities = activeCategory === "All" 
    ? recoveryCatalog 
    : recoveryCatalog.filter(a => a.category === activeCategory);

  return (
    <>
      <div className="screen" style={{ padding: "24px 16px 120px 16px" }}>
        {/* Header */}
        <div className="flex items-center" style={{ gap: "16px", marginBottom: "24px" }}>
          <Link href="/" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <ChevronLeft size={20} color="#1A1A3E" />
          </Link>
          <h1 className="text-xl font-black" style={{ color: "#1A1A3E" }}>Recovery Hub</h1>
        </div>

        {/* Intro */}
        <div className="rounded-3xl" style={{ padding: "24px", marginBottom: "24px", background: "linear-gradient(135deg, #1A1A3E 0%, #2D2B6B 100%)" }}>
          <p className="text-2xl mb-2">🌱</p>
          <p className="text-lg font-bold text-white mb-2">Schedule your recovery.</p>
          <p className="text-sm" style={{ color: "#B8B5FF", lineHeight: 1.5 }}>
            Recovery time is not wasted time. It is part of maintaining a sustainable workload.
          </p>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto scrollbar-hide" style={{ gap: "8px", paddingBottom: "8px", marginBottom: "16px", scrollbarWidth: "none" }}>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="rounded-full font-bold text-sm flex-shrink-0 transition-colors"
              style={{ 
                padding: "8px 16px",
                background: activeCategory === cat ? "#6C63FF" : "white", 
                color: activeCategory === cat ? "white" : "#8B8FB5",
                boxShadow: activeCategory === cat ? "0 4px 12px rgba(108,99,255,0.2)" : "0 2px 8px rgba(0,0,0,0.03)"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Activities List */}
        <div className="flex flex-col" style={{ gap: "12px" }}>
          {displayedActivities.map(act => (
            <div key={act.id} className="rounded-2xl flex items-center justify-between" style={{ padding: "16px", background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center" style={{ gap: "16px" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "#F8F9FF" }}>
                  {act.emoji}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>{act.title}</p>
                  <p className="text-xs" style={{ color: "#8B8FB5" }}>{act.durationMinutes} min • {act.category}</p>
                </div>
              </div>
              <button onClick={() => alert(`Added ${act.title} to your schedule!`)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#EEF0FF" }}>
                <CalendarPlus size={16} color="#6C63FF" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
