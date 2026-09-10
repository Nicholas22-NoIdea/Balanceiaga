// Smart Notification System - mock data, types, messages

export type NotifType = "starting_soon" | "task_ending" | "overrun" | "rebalance" | "motivational" | "forgotten" | "insight";
export type TaskStatus = "scheduled" | "in_progress" | "completed" | "delayed" | "unknown";
export type MotivationStyle = "encouraging" | "calm" | "friendly" | "goal" | "playful" | "minimal" | "off";
export type NotifFrequency = "all" | "important" | "minimal";

export interface NotifAction {
  id: string;
  label: string;
  variant: "primary" | "secondary" | "danger" | "ghost";
  icon?: string;
}

export interface RebalanceOption {
  id: string;
  title: string;
  description: string;
  action: string;
  workloadBefore: number;
  workloadAfter: number;
  isRecommended: boolean;
  risk: "low" | "medium" | "high";
  emoji: string;
}

export interface Badge {
  id: string;
  emoji: string;
  title: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
  count?: number;
}

export interface TaskHistoryRecord {
  taskId: string;
  taskName: string;
  category: string;
  plannedStart: string;
  actualStart?: string;
  plannedDuration: number;
  actualDuration?: number;
  overrunMinutes?: number;
  status: TaskStatus;
  confidence: "high" | "medium" | "low";
  userResponse?: string;
}

export interface NotifSettings {
  reminderMinutes: number;
  endingReminder: boolean;
  overrunAlerts: boolean;
  rebalanceAlerts: boolean;
  quietHoursEnabled: boolean;
  quietStart: string;
  quietEnd: string;
  motivationStyle: MotivationStyle;
  frequency: NotifFrequency;
  emailNotifications: boolean;
}

export const defaultSettings: NotifSettings = {
  reminderMinutes: 15,
  endingReminder: true,
  overrunAlerts: true,
  rebalanceAlerts: true,
  quietHoursEnabled: true,
  quietStart: "23:00",
  quietEnd: "07:00",
  motivationStyle: "calm",
  frequency: "important",
  emailNotifications: false,
};

export const mockBadges: Badge[] = [
  { id: "b1", emoji: "balance_scale", title: "Balanced Day", description: "Successfully rebalanced an overloaded schedule", earned: true, earnedAt: "Sep 8", count: 3 },
  { id: "b2", emoji: "brain", title: "Deep Work", description: "Completed a High mental-demand task", earned: true, earnedAt: "Sep 9", count: 5 },
  { id: "b3", emoji: "zzz", title: "Sleep Protected", description: "Finished all tasks before midnight", earned: true, earnedAt: "Sep 10", count: 7 },
  { id: "b4", emoji: "seedling", title: "Recovery Break", description: "Took a break between high-demand sessions", earned: false },
  { id: "b5", emoji: "calendar", title: "Realistic Planner", description: "Added tasks with accurate time estimates", earned: true, earnedAt: "Sep 7", count: 2 },
  { id: "b6", emoji: "arrows", title: "Flexible Thinker", description: "Moved a task instead of overloading the day", earned: false },
];

export const taskHistoryMock: TaskHistoryRecord[] = [
  { taskId: "h1", taskName: "Database Assignment", category: "Academic", plannedStart: "2026-09-08T20:00", actualStart: "2026-09-08T20:12", plannedDuration: 2, actualDuration: 2.5, overrunMinutes: 30, status: "completed", confidence: "high", userResponse: "took_longer" },
  { taskId: "h2", taskName: "Exam Revision", category: "Academic", plannedStart: "2026-09-07T09:00", actualStart: "2026-09-07T09:05", plannedDuration: 2, actualDuration: 2, status: "completed", confidence: "high", userResponse: "finished_time" },
  { taskId: "h3", taskName: "Research Paper", category: "Academic", plannedStart: "2026-09-06T14:00", actualStart: "2026-09-06T14:20", plannedDuration: 2, actualDuration: 2.8, overrunMinutes: 48, status: "completed", confidence: "medium", userResponse: "took_longer" },
];

type MessageEntry = { trigger: string; messages: { text: string; sub: string }[] };
const motivationalPool: Record<string, MessageEntry[]> = {
  calm: [
    { trigger: "high_workload", messages: [
      { text: "You have a lot on your plate today.", sub: "Take it one step at a time." },
      { text: "You do not have to finish everything at once.", sub: "Let us make today manageable." },
    ]},
    { trigger: "long_session", messages: [{ text: "You have been working for a while.", sub: "A short break can help you come back stronger." }]},
    { trigger: "morning", messages: [{ text: "Good morning.", sub: "Start small, stay steady, and let the day unfold." }]},
    { trigger: "evening", messages: [{ text: "You have done enough for today.", sub: "Rest is part of progress too." }]},
    { trigger: "rebalanced", messages: [{ text: "Nice choice.", sub: "You have created some breathing room for yourself." }]},
    { trigger: "completed_hard", messages: [{ text: "That was a demanding task.", sub: "Give yourself a moment before moving on." }]},
  ],
  encouraging: [
    { trigger: "high_workload", messages: [{ text: "Heavy day ahead - you have got this.", sub: "Break it into pieces and tackle one at a time." }]},
    { trigger: "completed_hard", messages: [{ text: "Nice work! One difficult task down.", sub: "Keep going at your own pace." }]},
    { trigger: "rebalanced", messages: [{ text: "Nice choice!", sub: "You have created some breathing room for yourself." }]},
  ],
  friendly: [
    { trigger: "high_workload", messages: [{ text: "Wow, big day!", sub: "You can always move things around if needed." }]},
    { trigger: "completed_hard", messages: [{ text: "You crushed it!", sub: "Time for a well-deserved break." }]},
  ],
  goal: [
    { trigger: "high_workload", messages: [{ text: "Focus on what matters most today.", sub: "The rest can wait." }]},
    { trigger: "rebalanced", messages: [{ text: "Smart move.", sub: "Protecting your focus is a strategy, not a compromise." }]},
  ],
  playful: [
    { trigger: "high_workload", messages: [{ text: "Juggling a lot today, huh?", sub: "Let us see if we can drop a ball or two safely." }]},
    { trigger: "long_session", messages: [{ text: "Your brain called.", sub: "It says it is hungry for a break." }]},
  ],
};

export function getMotivationalMessage(trigger: string, style: MotivationStyle = "calm"): { text: string; sub: string } | null {
  if (style === "off" || style === "minimal") return null;
  const pool = motivationalPool[style] ?? motivationalPool["calm"];
  const match = pool.find((p) => p.trigger === trigger);
  if (!match || match.messages.length === 0) {
    return { text: "Keep going.", sub: "You are doing better than you think." };
  }
  return match.messages[Math.floor(Math.random() * match.messages.length)];
}

export function getPatternInsight(category: string): string | null {
  const relevant = taskHistoryMock.filter((t) => t.category === category && t.overrunMinutes && t.overrunMinutes > 0);
  if (relevant.length < 2) return null;
  const avgOverrun = relevant.reduce((s, t) => s + (t.overrunMinutes ?? 0), 0) / relevant.length;
  if (avgOverrun > 15) {
    return "Based on your last " + relevant.length + " " + category + " tasks, you usually need ~" + Math.round(avgOverrun) + " extra minutes. Want to add a buffer?";
  }
  return null;
}
