import { Task } from "@/lib/mockData";
import { Shield, Clock } from "lucide-react";

const categoryColors: Record<string, { color: string; bg: string }> = {
  Academic: { color: "#6C63FF", bg: "#EEF0FF" },
  Social:   { color: "#FF6B9D", bg: "#FFF0F5" },
  Errands:  { color: "#FF7043", bg: "#FFF3F0" },
  Other:    { color: "#00C9B1", bg: "#F0FDFA" },
};

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  pending:     { label: "Pending",     color: "#FF7043", bg: "#FFF3F0" },
  "in-progress": { label: "In Progress", color: "#6C63FF", bg: "#EEF0FF" },
  done:        { label: "Done",        color: "#00C853", bg: "#F0FDF4" },
  overdue:     { label: "Overdue",     color: "#FF4444", bg: "#FFF0F0" },
};

interface TaskCardProps {
  task: Task;
  showSlot?: { startTime: string; endTime: string };
}

export default function TaskCard({ task, showSlot }: TaskCardProps) {
  const cat = categoryColors[task.category] ?? categoryColors["Other"];
  const st = statusLabels[task.status] ?? statusLabels["pending"];

  return (
    <div className="card flex items-start gap-3">
      {/* Category dot */}
      <div className="mt-1 w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-snug" style={{ color: "#1A1A3E" }}>
            {task.title}
          </p>
          {task.isProtected && (
            <Shield size={14} color="#6C63FF" className="flex-shrink-0 mt-0.5" />
          )}
        </div>
        {showSlot && (
          <p className="text-xs mt-0.5" style={{ color: "#8B8FB5" }}>
            {showSlot.startTime} – {showSlot.endTime}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="pill" style={{ color: cat.color, background: cat.bg }}>
            {task.category}
          </span>
          <span className="pill" style={{ color: st.color, background: st.bg }}>
            {st.label}
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: "#8B8FB5" }}>
            <Clock size={11} />
            {task.estimatedHours}h total
          </span>
        </div>
      </div>
    </div>
  );
}
