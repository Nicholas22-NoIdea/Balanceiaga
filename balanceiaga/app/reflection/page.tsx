"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Send } from "lucide-react";
import BottomNav from "@/components/BottomNav";

type Mood = "manageable" | "okay" | "overloaded" | null;

const moods: { id: Mood; emoji: string; label: string; color: string; bg: string }[] = [
  { id: "manageable", emoji: "😌", label: "Manageable", color: "#00C853", bg: "#F0FDF4" },
  { id: "okay", emoji: "😐", label: "Okay", color: "#FF7043", bg: "#FFF3F0" },
  { id: "overloaded", emoji: "😫", label: "Overloaded", color: "#FF4444", bg: "#FFF0F0" },
];

// Mock AI-learning history
const history = [
  {
    week: "Week of 25 Aug",
    planned: 10,
    actual: 13,
    reflection: "Took way longer than expected on the report.",
    pattern: "Academic tasks underestimated by ~30%",
    patternColor: "#FF7043",
  },
  {
    week: "Week of 18 Aug",
    planned: 8,
    actual: 8,
    reflection: "Felt balanced this week.",
    pattern: "Good estimation — on track",
    patternColor: "#00C853",
  },
  {
    week: "Week of 11 Aug",
    planned: 12,
    actual: 15,
    reflection: "Wednesday was really exhausting.",
    pattern: "Mid-week overload pattern detected",
    patternColor: "#FF4444",
  },
];

export default function WeeklyReflection() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"reflect" | "history">("reflect");

  const handleSubmit = () => {
    if (!selectedMood) return;
    setSubmitted(true);
  };

  return (
    <>
      <div className="screen px-4 pt-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: "#EEF0FF" }}
          >
            <ArrowLeft size={18} color="#6C63FF" />
          </button>
          <div>
            <p className="text-lg font-bold" style={{ color: "#1A1A3E" }}>Weekly Reflection</p>
            <p className="text-xs" style={{ color: "#8B8FB5" }}>Week of 1–7 Sep 2026</p>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex rounded-xl p-1"
          style={{ background: "#EBEBFF", margin: "10px 0" }}
        >
          {(["reflect", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 rounded-lg text-sm font-semibold capitalize transition-all"
              style={{
                background: activeTab === tab ? "white" : "transparent",
                color: activeTab === tab ? "#6C63FF" : "#8B8FB5",
                boxShadow: activeTab === tab ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                padding: "10px 0",
              }}
            >
              {tab === "reflect" ? "This Week" : "AI Insights"}
            </button>
          ))}
        </div>

        {/* ── TAB: THIS WEEK ── */}
        {activeTab === "reflect" && !submitted && (
          <div className="flex flex-col" style={{ gap: 20, marginTop: 10 }}>
            {/* Mood question */}
            <div className="card" style={{ marginBottom: 0, padding: "24px" }}>
              <p className="text-base font-bold mb-2" style={{ color: "#1A1A3E" }}>
                How did your week actually feel?
              </p>
              <p className="text-xs mb-5" style={{ color: "#8B8FB5" }}>
                Be honest — this helps us improve your future schedules.
              </p>
              <div className="flex flex-col" style={{ gap: 12 }}>
                {moods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.id)}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all"
                    style={{
                      background: selectedMood === m.id ? m.bg : "#F8F8FF",
                      border: `2px solid ${selectedMood === m.id ? m.color : "transparent"}`,
                    }}
                  >
                    <span style={{ fontSize: 30 }}>{m.emoji}</span>
                    <span
                      className="text-base font-semibold"
                      style={{ color: selectedMood === m.id ? m.color : "#1A1A3E" }}
                    >
                      {m.label}
                    </span>
                    {selectedMood === m.id && (
                      <span
                        className="ml-auto pill text-xs"
                        style={{ background: m.bg, color: m.color }}
                      >
                        Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional text */}
            <div className="card" style={{ marginBottom: 0, padding: "24px" }}>
              <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}>
                ANYTHING TO ADD? (OPTIONAL)
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Wednesday was really exhausting."
                rows={4}
                className="w-full text-sm outline-none resize-none placeholder:text-gray-300"
                style={{ color: "#1A1A3E", background: "transparent", lineHeight: 1.8 }}
              />
            </div>

            {/* This week's stats */}
            <div className="card" style={{ marginBottom: 0, padding: "24px" }}>
              <p className="text-base font-bold mb-4" style={{ color: "#1A1A3E" }}>This Week&apos;s Stats</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl" style={{ background: "#F0F1FF" }}>
                  <p className="text-xs mb-1" style={{ color: "#8B8FB5" }}>Planned</p>
                  <p className="text-xl font-extrabold" style={{ color: "#6C63FF" }}>11h</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "#FFF3F0" }}>
                  <p className="text-xs mb-1" style={{ color: "#8B8FB5" }}>Actual</p>
                  <p className="text-xl font-extrabold" style={{ color: "#FF7043" }}>16h</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "#FFF0F0" }}>
                  <p className="text-xs mb-1" style={{ color: "#8B8FB5" }}>Diff</p>
                  <p className="text-xl font-extrabold" style={{ color: "#FF4444" }}>+5h</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedMood}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg"
              style={{
                background: selectedMood ? "#6C63FF" : "#E5E7EB",
                color: selectedMood ? "white" : "#9CA3AF",
                cursor: selectedMood ? "pointer" : "not-allowed",
              }}
            >
              <Send size={20} />
              Submit Reflection
            </button>
          </div>
        )}

        {/* ── SUBMITTED STATE ── */}
        {activeTab === "reflect" && submitted && (
          <div className="flex flex-col" style={{ gap: 16 }}>
            <div
              className="card text-center py-8"
              style={{ background: "linear-gradient(135deg, #6C63FF 0%, #A78BFA 100%)", marginBottom: 0 }}
            >
              <span style={{ fontSize: 40 }}>
                {moods.find((m) => m.id === selectedMood)?.emoji}
              </span>
              <p className="text-xl font-extrabold text-white mt-3 mb-1">Reflection Saved!</p>
              <p className="text-sm text-white opacity-80">
                We&apos;ll use this to improve your future schedules.
              </p>
            </div>

            {text && (
              <div className="card" style={{ marginBottom: 0, border: "1.5px solid #EEF0FF" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "#8B8FB5" }}>YOUR NOTE</p>
                <p className="text-sm" style={{ color: "#1A1A3E" }}>&quot;{text}&quot;</p>
              </div>
            )}

            <div className="card" style={{ marginBottom: 0, background: "#F0FDF4", border: "1.5px solid #BBF7D0" }}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} color="#00C853" />
                <p className="text-sm font-bold" style={{ color: "#00C853" }}>AI Insight</p>
              </div>
              <p className="text-xs" style={{ color: "#1A1A3E" }}>
                You consistently underestimate academic tasks. Next week we&apos;ll add a 20% buffer automatically.
              </p>
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full py-4 rounded-2xl font-bold text-base"
              style={{ background: "#1A1A3E", color: "white" }}
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {/* ── TAB: AI INSIGHTS ── */}
        {activeTab === "history" && (
          <div className="flex flex-col" style={{ gap: 20, marginTop: 10 }}>
            {/* AI learning summary */}
            <div
              className="card"
              style={{ background: "linear-gradient(135deg, #1A1A3E 0%, #2D2B6B 100%)", marginBottom: 0, padding: "24px" }}
            >
              <p className="text-base font-bold text-white mb-1">AI Learning Summary</p>
              <p className="text-xs mb-4" style={{ color: "#A8A8D0" }}>
                Based on your past 3 weeks of reflections.
              </p>
              <div className="flex flex-col" style={{ gap: 8 }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#A8A8D0" }}>Avg underestimate</span>
                  <span className="text-xs font-bold text-white">+2.7h / week</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#A8A8D0" }}>Most taxing day</span>
                  <span className="text-xs font-bold text-white">Wednesday</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#A8A8D0" }}>Buffer added next week</span>
                  <span
                    className="pill text-xs"
                    style={{ background: "#6C63FF", color: "white" }}
                  >
                    +20% Academic
                  </span>
                </div>
              </div>
            </div>

            {/* Week-by-week history */}
            <p className="text-base font-bold" style={{ color: "#1A1A3E" }}>Past Reflections</p>
            {history.map((h) => {
              const diff = h.actual - h.planned;
              const isOver = diff > 0;
              const isEqual = diff === 0;
              return (
                <div key={h.week} className="card" style={{ marginBottom: 0 }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>{h.week}</p>
                    <span
                      className="pill text-xs flex items-center gap-1"
                      style={{ color: h.patternColor, background: `${h.patternColor}18` }}
                    >
                      {isEqual ? <Minus size={11} /> : isOver ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {isEqual ? "On track" : isOver ? `+${diff}h over` : `${diff}h under`}
                    </span>
                  </div>

                  {/* Planned → Actual flow */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 p-2 rounded-xl text-center" style={{ background: "#EEF0FF" }}>
                      <p className="text-xs" style={{ color: "#8B8FB5" }}>Planned</p>
                      <p className="text-base font-extrabold" style={{ color: "#6C63FF" }}>{h.planned}h</p>
                    </div>
                    <span style={{ color: "#B0B3D6", fontSize: 18 }}>→</span>
                    <div
                      className="flex-1 p-2 rounded-xl text-center"
                      style={{ background: isOver ? "#FFF3F0" : "#F0FDF4" }}
                    >
                      <p className="text-xs" style={{ color: "#8B8FB5" }}>Actual</p>
                      <p
                        className="text-base font-extrabold"
                        style={{ color: isOver ? "#FF7043" : "#00C853" }}
                      >
                        {h.actual}h
                      </p>
                    </div>
                  </div>

                  {/* Reflection note */}
                  {h.reflection && (
                    <div className="px-3 py-2 rounded-xl mb-2" style={{ background: "#F8F8FF" }}>
                      <p className="text-xs" style={{ color: "#8B8FB5" }}>
                        💬 &quot;{h.reflection}&quot;
                      </p>
                    </div>
                  )}

                  {/* AI pattern */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: h.patternColor }}
                    />
                    <p className="text-xs font-semibold" style={{ color: h.patternColor }}>
                      {h.pattern}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}
