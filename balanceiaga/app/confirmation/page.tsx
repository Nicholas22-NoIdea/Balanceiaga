"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Home, Sparkles } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { mockRebalanceOptions, mockCapacity, RebalanceOption } from "@/lib/mockData";

const recoveryActivities = ["🚶 Walk", "🎵 Music", "😴 Rest", "👋 Meet a friend"];

export default function Confirmation() {
  const [accepted, setAccepted] = useState<RebalanceOption>(mockRebalanceOptions[0]);
  const cap = mockCapacity;

  useEffect(() => {
    try {
      const stored = localStorage.getItem("balanceiaga_accepted_rebalance");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.changes) {
          setAccepted(parsed);
        }
      }
    } catch (err) {
      console.warn("Could not read accepted rebalance from storage:", err);
    }
  }, []);

  return (
    <>
      <div className="screen px-4 pt-6 pb-20">
        {/* Success hero */}
        <div
          className="card mb-4 text-center py-8"
          style={{ background: "linear-gradient(135deg, #6C63FF 0%, #A78BFA 100%)" }}
        >
          <div className="flex justify-center mb-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <CheckCircle size={36} color="white" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-white mb-1">Week Rebalanced!</p>
          <p className="text-sm text-white opacity-90">
            {accepted.label} applied successfully.
          </p>
        </div>

        {/* Before / After */}
        <div className="card mb-4">
          <p className="text-sm font-bold mb-3" style={{ color: "#1A1A3E" }}>Before → After</p>
          <div className="flex gap-4">
            <div className="flex-1 p-3 rounded-xl" style={{ background: "#FFF0F0" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#FF4444" }}>Before</p>
              <p className="text-xl font-bold" style={{ color: "#FF4444" }}>{cap.overloadPercent}%</p>
              <p className="text-xs" style={{ color: "#FF8888" }}>{cap.totalWorkload}h / {cap.realisticCapacity}h</p>
            </div>
            <div className="flex items-center">
              <span style={{ fontSize: 20 }}>→</span>
            </div>
            <div className="flex-1 p-3 rounded-xl" style={{ background: "#F0FDF4" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#00C853" }}>After</p>
              <p className="text-xl font-bold" style={{ color: "#00C853" }}>{accepted.resultingPercent}%</p>
              <p className="text-xs" style={{ color: "#86EFAC" }}>
                {Math.max(0, cap.totalWorkload - accepted.hoursFreed)}h / {cap.realisticCapacity}h
              </p>
            </div>
          </div>
        </div>

        {/* Changes applied */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>Changes Applied</p>
            <span className="pill text-xs" style={{ background: "#EEF0FF", color: "#6C63FF" }}>
              {accepted.changes.length} adjustments
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {accepted.changes.map((change) => (
              <div key={change.taskId} className="flex items-start gap-2.5 p-2 rounded-xl" style={{ background: "#F8F8FF" }}>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "#00C853", color: "white" }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700 }}>✓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-bold" style={{ color: "#1A1A3E" }}>{change.taskTitle}</span>
                    <span className="pill text-xs px-1.5 py-0.5" style={{ background: "#E0E7FF", color: "#4F46E5", fontSize: 10 }}>
                      {change.action}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "#8B8FB5" }}>{change.detail}</p>
                </div>
                <span className="ml-auto text-xs font-bold whitespace-nowrap" style={{ color: "#00C853" }}>
                  −{change.hoursSaved}h
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery */}
        <div className="card mb-4" style={{ border: "1.5px solid #EEF0FF" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={16} color="#6C63FF" />
            <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>
              🎉 You recovered {accepted.hoursFreed}h
            </p>
          </div>
          <p className="text-xs mb-3" style={{ color: "#8B8FB5" }}>Protect this time for your wellbeing?</p>
          <div className="flex gap-2 flex-wrap">
            {recoveryActivities.map((act) => (
              <button
                key={act}
                className="pill transition-transform active:scale-95 cursor-pointer"
                style={{ background: "#EEF0FF", color: "#6C63FF" }}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm mb-4 transition-transform active:scale-95"
          style={{ background: "#1A1A3E", color: "white" }}
        >
          <Home size={16} />
          Back to Dashboard
        </Link>
      </div>
      <BottomNav />
    </>
  );
}
