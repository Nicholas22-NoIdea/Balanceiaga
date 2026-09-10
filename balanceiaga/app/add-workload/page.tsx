"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Shield, Plus, Minus, Brain, Clock, AlertTriangle,
  Zap, Sparkles, ChevronDown, ChevronUp, CheckCircle2, ArrowRight
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

type Category = "Academic" | "Social" | "Errands" | "Other";
type Priority = "High" | "Medium" | "Low";
type MentalDemand = "Low" | "Medium" | "High";
type Flexibility = "Fixed" | "Can Move" | "Flexible";
type ConsequenceOfDelay = "Minor" | "Moderate" | "Critical";
type Tab = "manual" | "ai";

const categoryColors: Record<Category, { color: string; bg: string }> = {
  Academic: { color: "#6C63FF", bg: "#EEF0FF" },
  Social: { color: "#FF6B9D", bg: "#FFF0F5" },
  Errands: { color: "#FF7043", bg: "#FFF3F0" },
  Other: { color: "#00C9B1", bg: "#F0FDFA" },
};

const priorityColors: Record<Priority, { color: string; bg: string }> = {
  High: { color: "#FF4444", bg: "#FFF0F0" },
  Medium: { color: "#FF7043", bg: "#FFF3F0" },
  Low: { color: "#00C853", bg: "#F0FDF4" },
};

const demandColors: Record<MentalDemand, { color: string; bg: string }> = {
  Low: { color: "#00C853", bg: "#F0FDF4" },
  Medium: { color: "#FF7043", bg: "#FFF3F0" },
  High: { color: "#FF4444", bg: "#FFF0F0" },
};

const flexColors: Record<Flexibility, { color: string; bg: string }> = {
  Fixed: { color: "#FF4444", bg: "#FFF0F0" },
  "Can Move": { color: "#FF7043", bg: "#FFF3F0" },
  Flexible: { color: "#00C853", bg: "#F0FDF4" },
};

const consequenceColors: Record<ConsequenceOfDelay, { color: string; bg: string }> = {
  Minor: { color: "#00C853", bg: "#F0FDF4" },
  Moderate: { color: "#FF7043", bg: "#FFF3F0" },
  Critical: { color: "#FF4444", bg: "#FFF0F0" },
};

interface Subtask {
  name: string;
  hours: number;
  emoji: string;
}

function simulateAIBreakdown(description: string): {
  taskName: string;
  subtasks: Subtask[];
  demand: MentalDemand;
  urgency: string;
  flexibility: Flexibility;
  complexity: string;
} {
  const lower = description.toLowerCase();
  const taskName = description.length > 50 ? description.substring(0, 50).trim() + "..." : description.trim();
  const subtasks: Subtask[] = [];

  if (lower.includes("research") || lower.includes("study") || lower.includes("review")) {
    subtasks.push({ name: "Research & Review", hours: 2, emoji: "🔍" });
  } else {
    subtasks.push({ name: "Understanding & Setup", hours: 1, emoji: "📖" });
  }
  if (lower.includes("design") || lower.includes("plan") || lower.includes("diagram") || lower.includes("architecture")) {
    subtasks.push({ name: "Planning & Design", hours: 3, emoji: "✏️" });
  } else {
    subtasks.push({ name: "Planning", hours: 1.5, emoji: "✏️" });
  }
  if (lower.includes("implement") || lower.includes("code") || lower.includes("build") || lower.includes("develop") || lower.includes("create")) {
    subtasks.push({ name: "Implementation", hours: 5, emoji: "⚙️" });
  } else if (lower.includes("report") || lower.includes("essay") || lower.includes("paper") || lower.includes("write")) {
    subtasks.push({ name: "Writing", hours: 4, emoji: "📝" });
  } else {
    subtasks.push({ name: "Core Work", hours: 3, emoji: "⚙️" });
  }
  if (lower.includes("test") || lower.includes("debug") || lower.includes("fix") || lower.includes("verify")) {
    subtasks.push({ name: "Testing & Debugging", hours: 2, emoji: "🧪" });
  }
  if (lower.includes("document") || lower.includes("report") || lower.includes("present") || lower.includes("slide")) {
    subtasks.push({ name: "Documentation / Presentation", hours: 2, emoji: "📋" });
  } else {
    subtasks.push({ name: "Review & Wrap-up", hours: 1, emoji: "✅" });
  }

  const isHard = lower.includes("exam") || lower.includes("assignment") || lower.includes("project") || lower.includes("complex") || lower.includes("difficult") || lower.includes("implement") || lower.includes("algorithm");
  const isEasy = lower.includes("grocery") || lower.includes("lunch") || lower.includes("meeting") || lower.includes("errand");
  const demand: MentalDemand = isHard ? "High" : isEasy ? "Low" : "Medium";

  const isUrgent = lower.includes("tomorrow") || lower.includes("urgent") || lower.includes("due") || lower.includes("deadline") || lower.includes("tonight");
  const urgency = isUrgent ? "⚠️ Urgent – deadline detected" : "📅 No immediate deadline detected";

  const isFixed = lower.includes("exam") || lower.includes("fixed") || lower.includes("scheduled") || lower.includes("appointment");
  const isFlexible = lower.includes("anytime") || lower.includes("flexible") || lower.includes("whenever");
  const flexibility: Flexibility = isFixed ? "Fixed" : isFlexible ? "Flexible" : "Can Move";

  const totalHours = subtasks.reduce((sum, s) => sum + s.hours, 0);
  const complexity = totalHours >= 10 ? "🔴 High Complexity" : totalHours >= 5 ? "🟡 Medium Complexity" : "🟢 Low Complexity";

  return { taskName, subtasks, demand, urgency, flexibility, complexity };
}

function computeWorkloadScore(hours: number, demand: MentalDemand, consequence: ConsequenceOfDelay, flexibility: Flexibility): number {
  const demandMultiplier = demand === "High" ? 2.5 : demand === "Medium" ? 1.5 : 1;
  const consequenceBonus = consequence === "Critical" ? 10 : consequence === "Moderate" ? 5 : 0;
  const flexPenalty = flexibility === "Fixed" ? 5 : flexibility === "Can Move" ? 2 : 0;
  return Math.round(hours * demandMultiplier * 2 + consequenceBonus + flexPenalty);
}

export default function AddWorkload() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("manual");
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [startTime, setStartTime] = useState("20:00");
  const [endTime, setEndTime] = useState("22:00");
  const [hours, setHours] = useState(2);
  const [sessions, setSessions] = useState(1);
  const [category, setCategory] = useState<Category>("Academic");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [demand, setDemand] = useState<MentalDemand>("Medium");
  const [flexibility, setFlexibility] = useState<Flexibility>("Can Move");
  const [consequence, setConsequence] = useState<ConsequenceOfDelay>("Moderate");
  const [isProtected, setIsProtected] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<ReturnType<typeof simulateAIBreakdown> | null>(null);
  const [showSubtasks, setShowSubtasks] = useState(true);

  const sessionDuration = sessions > 0 ? (hours / sessions).toFixed(1) : "0";
  const workloadScore = computeWorkloadScore(hours, demand, consequence, flexibility);

  const deadlineLabel = (() => {
    if (!deadline) return "No deadline set";
    const d = new Date(deadline);
    const today = new Date();
    const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return "Due today";
    if (diff === 1) return "Due tomorrow";
    if (diff <= 7) return `Due in ${diff} days`;
    return `Due ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  })();

  const handleSubmit = async () => {
    if (!title || !deadline) return;
    setSubmitting(true);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, deadline, estimatedHours: hours, sessions, category, priority, isProtected, demand, flexibility, consequence, startTime, endTime }),
    }).catch(() => { });
    setTimeout(() => router.push("/overload"), 400);
  };

  const handleAnalyze = async () => {
    if (!aiDescription.trim()) return;
    setAnalyzing(true);
    setAiResult(null);
    await new Promise((r) => setTimeout(r, 1800));
    setAiResult(simulateAIBreakdown(aiDescription));
    setAnalyzing(false);
    setShowSubtasks(true);
  };

  const handleUseBreakdown = () => {
    if (!aiResult) return;
    const totalHours = Math.round(aiResult.subtasks.reduce((sum, s) => sum + s.hours, 0));
    setTitle(aiResult.taskName);
    setHours(totalHours);
    setSessions(aiResult.subtasks.length);
    setDemand(aiResult.demand);
    setFlexibility(aiResult.flexibility);
    setActiveTab("manual");
  };

  return (
    <>
      <div className="screen px-4 pt-6">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: "#EEF0FF" }}>
            <ArrowLeft size={18} color="#6C63FF" />
          </button>
          <div>
            <p className="text-lg font-bold" style={{ color: "#1A1A3E" }}>Add Workload</p>
            <p className="text-xs" style={{ color: "#8B8FB5" }}>{"Tell us what you're carrying"}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-5 rounded-2xl" style={{ margin: "5px 0 25px 0", padding: "5px", background: "#EBEBFF" }}>
          <button onClick={() => setActiveTab("manual")} className="flex-1 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
            style={{ padding: "10px 0", background: activeTab === "manual" ? "#6C63FF" : "transparent", color: activeTab === "manual" ? "white" : "#8B8FB5" }}>
            <Clock size={14} /> Manual Entry
          </button>
          <button onClick={() => setActiveTab("ai")} className="flex-1 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
            style={{ padding: "10px 0", background: activeTab === "ai" ? "#6C63FF" : "transparent", color: activeTab === "ai" ? "white" : "#8B8FB5" }}>
            <Sparkles size={14} /> AI Analysis
          </button>
        </div>

        {activeTab === "manual" && (
          <div className="flex flex-col" style={{ gap: 11 }}>
            <div className="card">
              <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B8FB5" }}>TASK TITLE</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Database Assignment"
                className="w-full text-sm font-medium outline-none placeholder:text-gray-300" style={{ color: "#1A1A3E", background: "transparent" }} />
            </div>

            <div className="card">
              <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}><Clock size={11} className="inline mr-1" />TIME SLOT</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-xl px-3 py-2 flex items-center gap-2" style={{ background: "#F0F1FF" }}>
                  <span className="text-xs font-semibold" style={{ color: "#8B8FB5" }}>From</span>
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="flex-1 text-sm font-bold outline-none" style={{ color: "#1A1A3E", background: "transparent" }} />
                </div>
                <ArrowRight size={16} color="#8B8FB5" />
                <div className="flex-1 rounded-xl px-3 py-2 flex items-center gap-2" style={{ background: "#F0F1FF" }}>
                  <span className="text-xs font-semibold" style={{ color: "#8B8FB5" }}>To</span>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="flex-1 text-sm font-bold outline-none" style={{ color: "#1A1A3E", background: "transparent" }} />
                </div>
              </div>
            </div>

            <div className="card">
              <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B8FB5" }}>DEADLINE</label>
              <div className="flex items-center gap-2">
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="flex-1 text-sm font-medium outline-none" style={{ color: "#1A1A3E", background: "transparent" }} />
                <ChevronDown size={16} color="#8B8FB5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="card">
                <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}>TOTAL HOURS</label>
                <div className="flex items-center justify-between">
                  <button onClick={() => setHours(Math.max(1, hours - 1))} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#F0F1FF" }}><Minus size={14} color="#6C63FF" /></button>
                  <span className="text-xl font-bold" style={{ color: "#1A1A3E" }}>{hours}h</span>
                  <button onClick={() => setHours(hours + 1)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#EEF0FF" }}><Plus size={14} color="#6C63FF" /></button>
                </div>
              </div>
              <div className="card">
                <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}>SESSIONS</label>
                <div className="flex items-center justify-between">
                  <button onClick={() => setSessions(Math.max(1, sessions - 1))} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#F0F1FF" }}><Minus size={14} color="#6C63FF" /></button>
                  <span className="text-xl font-bold" style={{ color: "#1A1A3E" }}>{sessions}</span>
                  <button onClick={() => setSessions(sessions + 1)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#EEF0FF" }}><Plus size={14} color="#6C63FF" /></button>
                </div>
              </div>
            </div>
            <div className="px-1"><p className="text-xs" style={{ color: "#8B8FB5" }}>Each session ≈ <span style={{ color: "#6C63FF", fontWeight: 600 }}>{sessionDuration}h</span></p></div>

            <div className="card">
              <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}><Brain size={11} className="inline mr-1" />MENTAL / PHYSICAL DEMAND</label>
              <div className="flex gap-2">
                {(["Low", "Medium", "High"] as MentalDemand[]).map((opt) => { const c = demandColors[opt]; const sel = demand === opt; return (<button key={opt} onClick={() => setDemand(opt)} className="pill flex-1" style={{ background: sel ? c.color : c.bg, color: sel ? "white" : c.color, border: `1.5px solid ${sel ? c.color : "transparent"}` }}>{opt}</button>); })}
              </div>
            </div>

            <div className="card">
              <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}>FLEXIBILITY — CAN IT BE MOVED?</label>
              <div className="flex gap-2">
                {(["Fixed", "Can Move", "Flexible"] as Flexibility[]).map((opt) => { const c = flexColors[opt]; const sel = flexibility === opt; return (<button key={opt} onClick={() => setFlexibility(opt)} className="pill flex-1" style={{ background: sel ? c.color : c.bg, color: sel ? "white" : c.color, border: `1.5px solid ${sel ? c.color : "transparent"}`, fontSize: "11px" }}>{opt}</button>); })}
              </div>
            </div>

            <div className="card">
              <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}><AlertTriangle size={11} className="inline mr-1" />CONSEQUENCE IF DELAYED</label>
              <div className="flex gap-2">
                {(["Minor", "Moderate", "Critical"] as ConsequenceOfDelay[]).map((opt) => { const c = consequenceColors[opt]; const sel = consequence === opt; return (<button key={opt} onClick={() => setConsequence(opt)} className="pill flex-1" style={{ background: sel ? c.color : c.bg, color: sel ? "white" : c.color, border: `1.5px solid ${sel ? c.color : "transparent"}` }}>{opt}</button>); })}
              </div>
            </div>

            <div className="card">
              <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}>CATEGORY</label>
              <div className="flex gap-2 flex-wrap">
                {(["Academic", "Social", "Errands", "Other"] as Category[]).map((cat) => { const c = categoryColors[cat]; const sel = category === cat; return (<button key={cat} onClick={() => setCategory(cat)} className="pill" style={{ background: sel ? c.color : c.bg, color: sel ? "white" : c.color, border: `1.5px solid ${sel ? c.color : "transparent"}` }}>{cat}</button>); })}
              </div>
            </div>

            <div className="card">
              <label className="text-xs font-semibold mb-3 block" style={{ color: "#8B8FB5" }}>PRIORITY — IS IT URGENT?</label>
              <div className="flex gap-2">
                {(["High", "Medium", "Low"] as Priority[]).map((p) => { const c = priorityColors[p]; const sel = priority === p; return (<button key={p} onClick={() => setPriority(p)} className="pill flex-1" style={{ background: sel ? c.color : c.bg, color: sel ? "white" : c.color }}>{p}</button>); })}
              </div>
            </div>

            <div className="card flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={16} color="#6C63FF" />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#1A1A3E" }}>Protected Commitment</p>
                  <p className="text-xs" style={{ color: "#8B8FB5" }}>{"Fixed — won't be moved by rebalancing"}</p>
                </div>
              </div>
              <button onClick={() => setIsProtected(!isProtected)} className="w-12 h-6 rounded-full transition-colors relative flex-shrink-0" style={{ background: isProtected ? "#6C63FF" : "#E5E7EB" }}>
                <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" style={{ left: isProtected ? "26px" : "4px" }} />
              </button>
            </div>

            {title && (
              <div className="rounded-2xl" style={{ padding: "16px", background: "linear-gradient(135deg, #1A1A3E 0%, #2D2B6B 100%)" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold tracking-wider" style={{ color: "#9B99CC" }}>WORKLOAD PREVIEW</p>
                  <div className="flex items-center gap-1.5 rounded-full" style={{ padding: "4px 12px", background: "rgba(108,99,255,0.3)" }}>
                    <Zap size={12} color="#A89CFF" />
                    <span className="text-xs font-bold" style={{ color: "#A89CFF" }}>+{workloadScore} pts</span>
                  </div>
                </div>
                <p className="text-base font-bold mb-1 truncate" style={{ color: "white" }}>{title}</p>
                <p className="text-xs mb-4" style={{ color: "#9B99CC" }}>{startTime} – {endTime}</p>
                <div className="flex flex-col gap-3">
                  {[
                    ["Mental Workload", demand, demandColors[demand]],
                    ["Deadline", deadlineLabel, null],
                    ["Flexibility", flexibility, flexColors[flexibility]],
                    ["If Delayed", `${consequence} Impact`, consequenceColors[consequence]],
                  ].map(([label, val, colors]) => (
                    <div key={String(label)} className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: "#9B99CC" }}>{String(label)}</span>
                      {colors ? (
                        <span className="text-xs font-bold rounded-full" style={{ padding: "2px 8px", background: (colors as {bg: string; color: string}).bg, color: (colors as {bg: string; color: string}).color }}>{String(val)}</span>
                      ) : (
                        <span className="text-xs font-bold" style={{ color: "white" }}>{String(val)}</span>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: "#9B99CC" }}>Rebalance Candidate?</span>
                    <span className="text-xs font-bold" style={{ color: flexibility === "Fixed" ? "#FF6B6B" : "#00C9B1" }}>{flexibility === "Fixed" ? "❌ Cannot Move" : "✅ Yes"}</span>
                  </div>
                </div>
              </div>
            )}

            <button onClick={handleSubmit} disabled={!title || !deadline || submitting} className="w-full py-5 rounded-2xl font-bold text-base"
              style={{ background: !title || !deadline ? "#E5E7EB" : "#6C63FF", color: !title || !deadline ? "#9CA3AF" : "white", cursor: !title || !deadline ? "not-allowed" : "pointer" }}>
              {submitting ? "Adding..." : "Add Task →"}
            </button>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="flex flex-col" style={{ gap: 14 }}>
            <div className="rounded-2xl flex gap-3" style={{ padding: "16px", background: "linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)" }}>
              <Sparkles size={28} color="white" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white mb-0.5">AI Workload Analyzer</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>Describe your task — or paste a brief, set of requirements, or syllabus. The AI will break it down into subtasks with time estimates.</p>
              </div>
            </div>

            <div className="card">
              <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B8FB5" }}>TASK DESCRIPTION / BRIEF</label>
              <textarea value={aiDescription} onChange={(e) => setAiDescription(e.target.value)}
                placeholder="e.g. Build a database management system for a university. Includes ER diagram, SQL schema, 5 complex queries, stored procedures, and a 3-page report. Due in 3 days."
                className="w-full text-sm font-medium outline-none resize-none placeholder:text-gray-300"
                style={{ color: "#1A1A3E", background: "transparent", minHeight: 130 }} rows={6} />
              <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: "1px solid #F0F1FF" }}>
                <span className="text-xs" style={{ color: "#B0B3D6" }}>{aiDescription.length} chars</span>
                <span className="text-xs" style={{ color: "#B0B3D6" }}>Tip: more detail = better estimate</span>
              </div>
            </div>

            <button onClick={handleAnalyze} disabled={!aiDescription.trim() || analyzing} className="w-full rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ padding: "10px 0", background: !aiDescription.trim() ? "#E5E7EB" : "linear-gradient(90deg, #6C63FF, #4F46E5)", color: !aiDescription.trim() ? "#9CA3AF" : "white", cursor: !aiDescription.trim() ? "not-allowed" : "pointer" }}>
              {analyzing ? (<><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />Analyzing...</>) : (<><Sparkles size={16} /> Analyze with AI</>)}
            </button>

            {aiResult && (
              <div className="flex flex-col" style={{ gap: 10 }}>
                <div className="rounded-2xl" style={{ padding: "16px", background: "#1A1A3E" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 size={16} color="#00C9B1" />
                    <p className="text-xs font-bold" style={{ color: "#9B99CC" }}>AI ANALYSIS COMPLETE</p>
                  </div>
                  <p className="text-sm font-bold text-white truncate mb-2">{aiResult.taskName}</p>
                  <div className="flex gap-2 flex-wrap" style={{ margin: "8px" }}>
                    <span className="text-xs rounded-full font-semibold" style={{ padding: "4px 8px", background: demandColors[aiResult.demand].bg, color: demandColors[aiResult.demand].color }}>🧠 {aiResult.demand} Demand</span>
                    <span className="text-xs rounded-full font-semibold" style={{ padding: "4px 8px", background: flexColors[aiResult.flexibility].bg, color: flexColors[aiResult.flexibility].color }}>{aiResult.flexibility}</span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: "#9B99CC" }}>{aiResult.urgency}</p>
                  <p className="text-xs" style={{ color: "#9B99CC" }}>{aiResult.complexity}</p>
                </div>

                <div className="card">
                  <button onClick={() => setShowSubtasks(!showSubtasks)} className="flex items-center justify-between w-full">
                    <label className="text-xs font-semibold" style={{ color: "#8B8FB5" }}>SUBTASK BREAKDOWN — {aiResult.subtasks.reduce((s, t) => s + t.hours, 0).toFixed(1)}h total</label>
                    {showSubtasks ? <ChevronUp size={16} color="#8B8FB5" /> : <ChevronDown size={16} color="#8B8FB5" />}
                  </button>
                  {showSubtasks && (
                    <div className="mt-3 flex flex-col gap-2">
                      {aiResult.subtasks.map((sub, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: "#F8F9FF" }}>
                          <div className="flex items-center gap-2">
                            <span className="text-base">{sub.emoji}</span>
                            <span className="text-sm font-semibold" style={{ color: "#1A1A3E" }}>{sub.name}</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "#EEF0FF" }}>
                            <Clock size={11} color="#6C63FF" />
                            <span className="text-xs font-bold" style={{ color: "#6C63FF" }}>{sub.hours}h</span>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl mt-1" style={{ background: "#EEF0FF" }}>
                        <span className="text-sm font-bold" style={{ color: "#6C63FF" }}>Total Estimate</span>
                        <span className="text-sm font-bold" style={{ color: "#6C63FF" }}>{aiResult.subtasks.reduce((s, t) => s + t.hours, 0).toFixed(1)}h</span>
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={handleUseBreakdown} className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2" style={{ padding: "10px 0", background: "#6C63FF", color: "white" }}>
                  <CheckCircle2 size={16} /> Use This Breakdown
                </button>
                <p className="text-center text-xs" style={{ color: "#B0B3D6" }}>Populates Manual Entry with estimated hours and inferred settings.</p>
              </div>
            )}
          </div>
        )}

        <div style={{ height: 24 }} />
      </div>
      <BottomNav />
    </>
  );
}