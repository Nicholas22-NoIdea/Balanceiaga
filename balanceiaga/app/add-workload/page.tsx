"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, Shield, Plus, Minus } from "lucide-react";
import BottomNav from "@/components/BottomNav";

type Category = "Academic" | "Social" | "Errands" | "Other";
type Priority = "High" | "Medium" | "Low";

const categories: Category[] = ["Academic", "Social", "Errands", "Other"];
const priorities: Priority[] = ["High", "Medium", "Low"];

const categoryColors: Record<Category, { color: string; bg: string; selected: string }> = {
  Academic: { color: "#6C63FF", bg: "#EEF0FF", selected: "#6C63FF" },
  Social: { color: "#FF6B9D", bg: "#FFF0F5", selected: "#FF6B9D" },
  Errands: { color: "#FF7043", bg: "#FFF3F0", selected: "#FF7043" },
  Other: { color: "#00C9B1", bg: "#F0FDFA", selected: "#00C9B1" },
};

export default function AddWorkload() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [hours, setHours] = useState(2);
  const [sessions, setSessions] = useState(1);
  const [category, setCategory] = useState<Category>("Academic");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [isProtected, setIsProtected] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sessionDuration = sessions > 0 ? (hours / sessions).toFixed(1) : "0";

  const handleSubmit = async () => {
    if (!title || !deadline) return;
    setSubmitting(true);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, deadline, estimatedHours: hours, sessions, category, priority, isProtected }),
    });
    setTimeout(() => router.push("/overload"), 400);
  };

  return (
    <>
      <div className="screen px-4 pt-6">
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
            <p className="text-lg font-bold" style={{ color: "#1A1A3E" }}>Add Workload</p>
            <p className="text-xs" style={{ color: "#8B8FB5" }}>Tell us what you need to get done</p>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col" style={{ gap: 11, marginTop: 16 }}>
          {/* Title */}
          <div className="card">
            <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B8FB5" }}>TASK TITLE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Database Assignment"
              className="w-full text-sm font-medium outline-none placeholder:text-gray-300"
              style={{ color: "#1A1A3E", background: "transparent" }}
            />
          </div>

          {/* Deadline */}
          <div className="card">
            <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B8FB5" }}>DEADLINE</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="flex-1 text-sm font-medium outline-none"
                style={{ color: "#1A1A3E", background: "transparent" }}
              />
              <ChevronDown size={16} color="#8B8FB5" />
            </div>
          </div>

          {/* Hours + Sessions */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card">
              <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}>TOTAL HOURS</label>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setHours(Math.max(1, hours - 1))}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "#F0F1FF" }}
                >
                  <Minus size={14} color="#6C63FF" />
                </button>
                <span className="text-xl font-bold" style={{ color: "#1A1A3E" }}>{hours}h</span>
                <button
                  onClick={() => setHours(hours + 1)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "#EEF0FF" }}
                >
                  <Plus size={14} color="#6C63FF" />
                </button>
              </div>
            </div>
            <div className="card">
              <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}>SESSIONS</label>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSessions(Math.max(1, sessions - 1))}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "#F0F1FF" }}
                >
                  <Minus size={14} color="#6C63FF" />
                </button>
                <span className="text-xl font-bold" style={{ color: "#1A1A3E" }}>{sessions}</span>
                <button
                  onClick={() => setSessions(sessions + 1)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "#EEF0FF" }}
                >
                  <Plus size={14} color="#6C63FF" />
                </button>
              </div>
            </div>
          </div>

          {/* Session duration hint */}
          <div className="px-1">
            <p className="text-xs" style={{ color: "#8B8FB5" }}>
              Each session ≈ <span style={{ color: "#6C63FF", fontWeight: 600 }}>{sessionDuration}h</span>
            </p>
          </div>

          {/* Category */}
          <div className="card">
            <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}>CATEGORY</label>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => {
                const style = categoryColors[cat];
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className="pill"
                    style={{
                      background: isSelected ? style.selected : style.bg,
                      color: isSelected ? "white" : style.color,
                      border: `1.5px solid ${isSelected ? style.selected : "transparent"}`,
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div className="card">
            <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}>PRIORITY</label>
            <div className="flex gap-2">
              {priorities.map((p) => {
                const colors = { High: "#FF4444", Medium: "#FF7043", Low: "#00C853" };
                const bgs = { High: "#FFF0F0", Medium: "#FFF3F0", Low: "#F0FDF4" };
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className="pill flex-1"
                    style={{
                      background: isSelected ? colors[p] : bgs[p],
                      color: isSelected ? "white" : colors[p],
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Protected toggle */}
          <div className="card flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={16} color="#6C63FF" />
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1A1A3E" }}>Protected Commitment</p>
                <p className="text-xs" style={{ color: "#8B8FB5" }}>Won&apos;t be moved by rebalancing</p>
              </div>
            </div>
            <button
              onClick={() => setIsProtected(!isProtected)}
              className="w-12 h-6 rounded-full transition-colors relative flex-shrink-0"
              style={{ background: isProtected ? "#6C63FF" : "#E5E7EB" }}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: isProtected ? "26px" : "4px" }}
              />
            </button>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!title || !deadline || submitting}
            className="w-full py-5 rounded-2xl font-bold text-base"
            style={{
              background: !title || !deadline ? "#E5E7EB" : "#6C63FF",
              color: !title || !deadline ? "#9CA3AF" : "white",
              cursor: !title || !deadline ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Adding..." : "Add Task →"}
          </button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
