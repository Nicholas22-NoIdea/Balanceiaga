"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, Settings, Brain, Clock, AlertTriangle, Zap,
  CheckCircle2, ChevronRight, X, RefreshCw, Sparkles,
  TrendingUp, Heart, Award
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

import { useNotifications, NotifType, Notif } from "@/lib/notificationStore";

type TabType = "all" | "tasks" | "insights" | "badges";

const rebalanceOptions = [
  { id: "opt1", emoji: "💤", title: "Protect Sleep", desc: "Move Study → Tue 4 PM", before: 82, after: 76, recommended: true },
  { id: "opt2", emoji: "🏃", title: "Move Gym", desc: "Move gym → Wed", before: 82, after: 70, recommended: false },
  { id: "opt3", emoji: "🔴", title: "Continue Plan", desc: "Push through tonight", before: 82, after: 94, recommended: false },
];

const badges = [
  { id: "b1", emoji: "⚖️", title: "Balanced Day", desc: "Rebalanced an overloaded schedule", earned: true, count: 3 },
  { id: "b2", emoji: "🧠", title: "Deep Work", desc: "Completed a High-demand task", earned: true, count: 5 },
  { id: "b3", emoji: "💤", title: "Sleep Protected", desc: "Finished all tasks before midnight", earned: true, count: 7 },
  { id: "b4", emoji: "🌱", title: "Recovery Break", desc: "Took a break between sessions", earned: false, count: 0 },
  { id: "b5", emoji: "📅", title: "Realistic Planner", desc: "Accurate time estimates", earned: true, count: 2 },
  { id: "b6", emoji: "🔄", title: "Flexible Thinker", desc: "Moved a task instead of overloading", earned: false, count: 0 },
];

const typeColors: Record<NotifType, { bg: string; border: string; accent: string }> = {
  starting_soon: { bg: "#EEF0FF", border: "#C7C3FF", accent: "#6C63FF" },
  task_ending: { bg: "#FFF3F0", border: "#FFD0C0", accent: "#FF7043" },
  overrun: { bg: "#FFF0F0", border: "#FFD0D0", accent: "#FF4444" },
  rebalance: { bg: "#F0FDFA", border: "#A7F3E4", accent: "#00C9B1" },
  motivational: { bg: "#F0FDF4", border: "#A7F3C8", accent: "#00C853" },
  forgotten: { bg: "#FFFBEB", border: "#FDE68A", accent: "#F59E0B" },
  insight: { bg: "#FAF0FF", border: "#E4BDFF", accent: "#9333EA" },
};

export default function NotificationsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<TabType>("all");
  const { notifs, unreadCount: unread, markRead, dismiss } = useNotifications();
  const [expandedOverrun, setExpandedOverrun] = useState<string | null>(null);
  const [chosenRebalance, setChosenRebalance] = useState<string | null>(null);
  const [forgottenAnswers, setForgottenAnswers] = useState<Record<string, string>>({});
  const [startedTasks, setStartedTasks] = useState<Record<string, boolean>>({});
  const [endedTasks, setEndedTasks] = useState<Record<string, string>>({});
  const [stillWorkingId, setStillWorkingId] = useState<string | null>(null);
  const [rebalanceApplied, setRebalanceApplied] = useState(false);

  const filtered = notifs.filter((n) => {
    if (n.dismissed) return false;
    if (tab === "tasks") return ["starting_soon", "task_ending", "overrun", "forgotten"].includes(n.type);
    if (tab === "insights") return ["insight", "motivational"].includes(n.type);
    return true;
  });

  const TabButton = ({ value, label, count }: { value: TabType; label: string; count?: number }) => (
    <button onClick={() => setTab(value)}
      className="flex-1 rounded-xl font-bold flex items-center justify-center gap-1.5"
      style={{ padding: "12px 0", fontSize: "14px", background: tab === value ? "#6C63FF" : "transparent", color: tab === value ? "white" : "#8B8FB5" }}>
      {label}{count ? <span className="w-5 h-5 rounded-full text-white flex items-center justify-center" style={{ background: tab === value ? "rgba(255,255,255,0.3)" : "#FF4444", fontSize: "11px" }}>{count}</span> : null}
    </button>
  );

  const renderStartingSoon = (n: Notif) => {
    const started = startedTasks[n.id];
    const c = typeColors.starting_soon;
    return (
      <div key={n.id} className="rounded-2xl" style={{ padding: "16px", marginBottom: "12px", background: c.bg, border: `1.5px solid ${c.border}` }}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: c.accent }}>
              <Bell size={16} color="white" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider" style={{ color: c.accent }}>STARTING SOON</p>
              {!n.read && <div className="w-2 h-2 rounded-full inline-block ml-1" style={{ background: "#FF4444" }} />}
            </div>
          </div>
          <button onClick={() => dismiss(n.id)}><X size={16} color="#B0B3D6" /></button>
        </div>

        <p className="text-sm font-bold mb-1" style={{ color: "#1A1A3E" }}>{n.emoji} {n.message}</p>
        {n.taskTime && <p className="text-xs mb-1" style={{ color: "#8B8FB5" }}>{n.taskTime}</p>}
        <div className="flex gap-2 mb-2">
          {n.demand && <span className="text-xs rounded-full font-semibold flex items-center gap-1" style={{ padding: "4px 8px", background: "#FFF0F0", color: "#FF4444" }}>🧠 {n.demand} Demand</span>}
          {n.workloadScore && <span className="text-xs rounded-full font-semibold flex items-center gap-1" style={{ padding: "4px 8px", background: "rgba(108,99,255,0.12)", color: "#6C63FF" }}><Zap size={10} /> {n.workloadScore}/100</span>}
        </div>
        {n.subMessage && <p className="text-xs mb-3" style={{ color: "#8B8FB5" }}>{n.subMessage}</p>}

        {started ? (
          <div className="flex items-center gap-2 rounded-xl" style={{ padding: "8px 12px", background: "#EEF0FF" }}>
            <CheckCircle2 size={14} color="#6C63FF" />
            <span className="text-xs font-bold" style={{ color: "#6C63FF" }}>In Progress — started {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        ) : (
          <div className="flex gap-2" style={{ marginTop: "5px" }}>
            <button onClick={() => { setStartedTasks((p) => ({ ...p, [n.id]: true })); markRead(n.id); router.push("/notifications/task-status"); }}
              className="flex-1 rounded-xl text-xs font-bold text-white" style={{ padding: "11.5px 0", background: c.accent }}>▶ Start Now</button>
            <button className="flex-1 rounded-xl text-xs font-bold" style={{ padding: "11.5px 0", background: "white", color: c.accent }}>⏱ Delay</button>
            <button onClick={() => router.push("/notifications/task-status")}
              className="flex-1 rounded-xl text-xs font-bold" style={{ padding: "11.5px 0", background: "white", color: "#8B8FB5" }}>⚡ Rebalance</button>
          </div>
        )}
      </div>
    );
  };

  const renderTaskEnding = (n: Notif) => {
    const answer = endedTasks[n.id];
    const c = typeColors.task_ending;
    return (
      <div key={n.id} className="rounded-2xl" style={{ padding: "16px", marginBottom: "12px", background: c.bg, border: `1.5px solid ${c.border}` }}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: c.accent }}>
              <Clock size={16} color="white" />
            </div>
            <p className="text-xs font-bold tracking-wider" style={{ color: c.accent }}>TASK ENDING</p>
          </div>
          <button onClick={() => dismiss(n.id)}><X size={16} color="#B0B3D6" /></button>
        </div>
        <p className="text-sm font-bold mb-1" style={{ color: "#1A1A3E" }}>{n.emoji} {n.message}</p>
        {n.taskTime && <p className="text-xs mb-3" style={{ marginBottom: "5px", color: "#8B8FB5" }}>{n.taskTime}</p>}

        {answer ? (
          <div>
            {answer === "finished" && (
              <div className="flex items-center gap-2 rounded-xl" style={{ padding: "8px 12px", background: "#F0FDF4" }}>
                <CheckCircle2 size={14} color="#00C853" />
                <span className="text-xs font-bold" style={{ marginBottom: "5px", color: "#00C853" }}>✓ Completed! Actual duration recorded.</span>
              </div>
            )}
            {answer === "still" && (
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: "#8B8FB5" }}>How much longer?</p>
                <div className="flex gap-2 flex-wrap">
                  {["15 min", "30 min", "1 hour", "Not sure"].map((opt) => (
                    <button key={opt} onClick={() => setEndedTasks((p) => ({ ...p, [n.id]: "extended_" + opt }))}
                      className="rounded-xl text-xs font-bold" style={{ padding: "10px 16px", background: "#EEF0FF", color: "#6C63FF" }}>{opt}</button>
                  ))}
                </div>
              </div>
            )}
            {answer.startsWith("extended_") && (
              <div className="flex items-center gap-2 rounded-xl" style={{ padding: "8px 12px", background: "#FFF3F0" }}>
                <Clock size={14} color="#FF7043" />
                <span className="text-xs font-bold" style={{ color: "#FF7043" }}>Extended by {answer.replace("extended_", "")} — checking conflicts...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2" style={{ marginTop: "5px" }}>
            <button onClick={() => { setEndedTasks((p) => ({ ...p, [n.id]: "finished" })); markRead(n.id); }}
              className="flex-1 rounded-xl text-xs font-bold text-white" style={{ padding: "11.5px 0", background: "#00C853" }}>✓ Finished</button>
            <button onClick={() => setEndedTasks((p) => ({ ...p, [n.id]: "still" }))}
              className="flex-1 rounded-xl text-xs font-bold" style={{ padding: "11.5px 0", background: "white", color: c.accent }}>⏱ Still Working</button>
            <button className="flex-1 rounded-xl text-xs font-bold" style={{ padding: "11.5px 0", background: "white", color: "#8B8FB5" }}>⏸ Pause</button>
          </div>
        )}
      </div>
    );
  };

  const renderOverrun = (n: Notif) => {
    const c = typeColors.overrun;
    const expanded = expandedOverrun === n.id;
    return (
      <div key={n.id} className="rounded-2xl overflow-hidden" style={{ marginBottom: "12px", border: `1.5px solid ${c.border}` }}>
        <div style={{ padding: "16px", background: c.bg }}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: c.accent }}>
                <AlertTriangle size={16} color="white" />
              </div>
              <p className="text-xs font-bold tracking-wider" style={{ color: c.accent }}>OVERRUN DETECTED</p>
            </div>
            <button onClick={() => dismiss(n.id)}><X size={16} color="#B0B3D6" /></button>
          </div>
          <p className="text-sm font-bold mb-1" style={{ color: "#1A1A3E" }}>{n.emoji} {n.message}</p>
          {n.subMessage && <p className="text-xs mb-3" style={{ color: "#8B8FB5" }}>{n.subMessage}</p>}

          {!rebalanceApplied ? (
            <div className="flex gap-2" style={{ marginTop: "5px" }}>
              <button onClick={() => { setExpandedOverrun(expanded ? null : n.id); markRead(n.id); }}
                className="flex-1 rounded-xl text-xs font-bold text-white" style={{ padding: "11.5px 0", background: c.accent }}>⚡ Rebalance</button>
              <button className="flex-1 rounded-xl text-xs font-bold" style={{ padding: "11.5px 0", background: "white", color: "#6C63FF" }}>Continue</button>
              <button className="flex-1 rounded-xl text-xs font-bold" style={{ padding: "11.5px 0", background: "white", color: "#8B8FB5" }}>Move Next</button>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl" style={{ padding: "8px 12px", marginTop: "7px", background: "#F0FDF4" }}>
              <CheckCircle2 size={14} color="#00C853" />
              <span className="text-xs font-bold" style={{ color: "#00C853" }}>🎉 Nice choice! You've created breathing room.</span>
            </div>
          )}
        </div>

        {expanded && !rebalanceApplied && (
          <div className="flex flex-col gap-3" style={{ padding: "16px", background: "white", borderTop: "1px solid #F0F1FF" }}>
            <p className="text-base font-bold" style={{ color: "#1A1A3E" }}>✨ Smart Rebalancing Options</p>
            {rebalanceOptions.map((opt) => (
              <button key={opt.id} onClick={() => setChosenRebalance(opt.id)}
                className="rounded-xl text-left"
                style={{ padding: "16px", background: chosenRebalance === opt.id ? "#EEF0FF" : "#F8F9FF", border: `1.5px solid ${chosenRebalance === opt.id ? "#6C63FF" : "#F0F1FF"}` }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{opt.emoji}</span>
                    <p className="text-sm font-bold" style={{ color: "#1A1A3E" }}>{opt.title}</p>
                    {opt.recommended && <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: "#EEF0FF", color: "#6C63FF" }}>★</span>}
                  </div>
                  <span className="text-sm font-bold">
                    <span style={{ color: "#9CA3AF" }}>{opt.before} → </span>
                    <span style={{ color: opt.after > opt.before ? "#FF4444" : "#00C853" }}>{opt.after}</span>
                    {opt.after > opt.before && <span style={{ color: "#FF4444" }}> ⚠️</span>}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "#8B8FB5" }}>{opt.desc}</p>
              </button>
            ))}
            {chosenRebalance && (
              <button onClick={() => { setRebalanceApplied(true); setExpandedOverrun(null); }}
                className="w-full rounded-xl font-bold text-sm text-white" style={{ padding: "12px 0", background: "#6C63FF" }}>
                Apply Rebalancing ✓
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMotivational = (n: Notif) => {
    const c = typeColors.motivational;
    return (
      <div key={n.id} className="rounded-2xl" style={{ padding: "16px", marginBottom: "12px", background: "linear-gradient(135deg, #F0FDF4, #ECFDF5)", border: `1.5px solid ${c.border}` }}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <p className="text-xs font-bold tracking-wider" style={{ color: c.accent }}>MOTIVATION</p>
          </div>
          <button onClick={() => dismiss(n.id)}><X size={16} color="#B0B3D6" /></button>
        </div>
        <p className="text-sm font-bold mb-1" style={{ color: "#1A1A3E" }}>{n.message}</p>
        {n.subMessage && <p className="text-xs mb-3" style={{ color: "#6B7280" }}>{n.subMessage}</p>}
        <div className="flex gap-2" style={{ marginTop: "5px" }}>
          <button onClick={() => router.push("/overload")} className="flex-1 rounded-xl text-xs font-bold text-white" style={{ padding: "11.5px 0", background: c.accent }}>✨ Find something to move</button>
          <button onClick={() => dismiss(n.id)} className="rounded-xl text-xs font-bold" style={{ padding: "11.5px 16px", background: "rgba(0,200,83,0.1)", color: c.accent }}>Got it</button>
        </div>
      </div>
    );
  };

  const renderForgotten = (n: Notif) => {
    const answer = forgottenAnswers[n.id];
    const c = typeColors.forgotten;
    return (
      <div key={n.id} className="rounded-2xl" style={{ padding: "16px", marginBottom: "12px", background: c.bg, border: `1.5px solid ${c.border}` }}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{n.emoji}</span>
            <p className="text-xs font-bold tracking-wider" style={{ color: c.accent }}>MISSED CHECK-IN</p>
          </div>
          <button onClick={() => dismiss(n.id)}><X size={16} color="#B0B3D6" /></button>
        </div>
        <p className="text-sm font-bold mb-1" style={{ color: "#1A1A3E" }}>{n.message}</p>
        {n.subMessage && <p className="text-xs mb-3" style={{ color: "#8B8FB5" }}>{n.subMessage}</p>}
        {answer ? (
          <div className="rounded-xl" style={{ padding: "8px 12px", background: "rgba(245,158,11,0.1)" }}>
            <p className="text-xs font-bold" style={{ color: c.accent }}>✓ Response recorded — thanks for letting us know!</p>
            {answer === "dont_remember" && <p className="text-xs mt-0.5" style={{ color: "#8B8FB5" }}>Stored with low confidence — won't heavily affect future predictions.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2" style={{ marginTop: "5px" }}>
            {[
              { id: "finished_time", label: "✓ Finished on time" },
              { id: "took_longer", label: "⏱ Took longer" },
              { id: "didnt_finish", label: "✗ Didn't finish" },
              { id: "dont_remember", label: "🤷 Don't remember" },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => { setForgottenAnswers((p) => ({ ...p, [n.id]: id })); markRead(n.id); }}
                className="rounded-xl text-xs font-bold" style={{ padding: "11.5px 0", background: "white", color: "#1A1A3E", border: "1.5px solid #F0F1FF" }}>{label}</button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderInsight = (n: Notif) => {
    const c = typeColors.insight;
    return (
      <div key={n.id} className="rounded-2xl" style={{ padding: "16px", marginBottom: "12px", background: c.bg, border: `1.5px solid ${c.border}` }}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: c.accent }}>
              <TrendingUp size={16} color="white" />
            </div>
            <p className="text-xs font-bold tracking-wider" style={{ color: c.accent }}>AI INSIGHT</p>
          </div>
          <button onClick={() => dismiss(n.id)}><X size={16} color="#B0B3D6" /></button>
        </div>
        <p className="text-sm font-bold mb-1" style={{ color: "#1A1A3E" }}>{n.emoji} {n.message}</p>
        {n.subMessage && <p className="text-xs mb-3" style={{ color: "#8B8FB5" }}>{n.subMessage}</p>}
        <div className="flex gap-2" style={{ marginTop: "5px" }}>
          <button className="flex-1 rounded-xl text-xs font-bold text-white" style={{ padding: "11.5px 0", background: c.accent }}>Yes, add buffer</button>
          <button onClick={() => dismiss(n.id)} className="rounded-xl text-xs font-bold" style={{ padding: "11.5px 16px", background: "rgba(147,51,234,0.1)", color: c.accent }}>Noted</button>
        </div>
      </div>
    );
  };

  const renderCard = (n: Notif) => {
    switch (n.type) {
      case "starting_soon": return renderStartingSoon(n);
      case "task_ending": return renderTaskEnding(n);
      case "overrun": return renderOverrun(n);
      case "motivational": return renderMotivational(n);
      case "forgotten": return renderForgotten(n);
      case "insight": return renderInsight(n);
      default: return null;
    }
  };

  return (
    <>
      <div className="screen" style={{ padding: "24px 16px 100px 16px" }}>
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: "32px" }}>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xl font-extrabold" style={{ color: "#1A1A3E" }}>Smart Alerts</p>
              {unread > 0 && (
                <span className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: "#FF4444" }}>{unread}</span>
              )}
            </div>
            <p className="text-xs" style={{ color: "#8B8FB5" }}>Your intelligent workload assistant</p>
          </div>
          <button onClick={() => router.push("/notifications/settings")}
            className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: "#EEF0FF" }}>
            <Settings size={18} color="#6C63FF" />
          </button>
        </div>

        {/* Live Task Banner */}
        <button onClick={() => router.push("/notifications/task-status")}
          className="w-full rounded-2xl flex items-center gap-3"
          style={{ marginBottom: "15px", padding: "16px", background: "linear-gradient(135deg, #1A1A3E, #2D2B6B)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(108,99,255,0.4)" }}>
            <Brain size={20} color="white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-white">Database Assignment</p>
            <p className="text-xs" style={{ color: "#9B99CC" }}>8:00 PM – 10:00 PM · Tap to track live</p>
          </div>
          <div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full mb-1" style={{ background: "rgba(108,99,255,0.3)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse " style={{ margin: "0 5px" }} />
              <span className="text-xs font-bold" style={{ marginRight: "5px", color: "#A89CFF" }}>Scheduled</span>
            </div>
            <ChevronRight size={16} color="#9B99CC" className="ml-auto" />
          </div>
        </button>

        {/* Tabs */}
        <div className="flex gap-1 rounded-2xl" style={{ marginBottom: "15px", padding: "6px", background: "#EBEBFF" }}>
          <TabButton value="all" label="All" count={unread || undefined} />
          <TabButton value="tasks" label="Tasks" />
          <TabButton value="insights" label="Insights" />
          <TabButton value="badges" label="Badges" />
        </div>

        {/* Notification Feed */}
        {tab !== "badges" && (
          <div className="flex flex-col gap-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl">🎉</span>
                <p className="text-sm font-bold mt-3" style={{ color: "#1A1A3E" }}>All caught up!</p>
                <p className="text-xs mt-1" style={{ color: "#8B8FB5" }}>No pending alerts right now.</p>
              </div>
            ) : (
              filtered.map((n) => renderCard(n))
            )}
          </div>
        )}

        {/* Badges Tab */}
        {tab === "badges" && (
          <div>
            <div className="rounded-2xl" style={{ padding: "16px", marginBottom: "20px", background: "linear-gradient(135deg, #6C63FF, #4F46E5)" }}>
              <p className="text-xs font-bold tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>BALANCE STREAK</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-extrabold text-white">4 days</p>
                <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.75)" }}>of healthy balance 🌱</p>
              </div>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>Streaks don't punish breaks — just celebrate balance!</p>
            </div>

            <p className="text-xs font-bold tracking-wider" style={{ marginBottom: "20px", color: "#8B8FB5" }}>YOUR ACHIEVEMENTS</p>
            <div className="grid grid-cols-2" style={{ gap: "12px" }}>
              {badges.map((b) => (
                <div key={b.id} className="rounded-2xl text-center"
                  style={{ padding: "16px", background: b.earned ? "white" : "#F8F9FF", opacity: b.earned ? 1 : 0.5, boxShadow: b.earned ? "0 4px 16px rgba(0,0,0,0.06)" : "none", border: b.earned ? "none" : "1.5px dashed #E5E7EB" }}>
                  <span className="text-3xl">{b.emoji}</span>
                  <p className="text-xs font-bold mt-2" style={{ color: "#1A1A3E" }}>{b.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#8B8FB5" }}>{b.desc}</p>
                  {b.earned && b.count && b.count > 1 && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#EEF0FF", color: "#6C63FF" }}>×{b.count}</span>
                  )}
                  {!b.earned && <p className="text-xs mt-1" style={{ color: "#B0B3D6" }}>Not yet earned</p>}
                </div>
              ))}
            </div>

            <div className="rounded-2xl" style={{ marginTop: "10px", padding: "16px", background: "#F8F9FF", border: "1.5px solid #EBEBFF" }}>
              <p className="text-xs font-bold mb-2" style={{ color: "#1A1A3E" }}>🎯 Core Principle</p>
              <p className="text-xs italic" style={{ color: "#8B8FB5" }}>The goal is not to do more. The goal is to create a sustainable balance.</p>
            </div>
          </div>
        )}

        <div style={{ height: 24 }} />
      </div>
      <BottomNav />
    </>
  );
}