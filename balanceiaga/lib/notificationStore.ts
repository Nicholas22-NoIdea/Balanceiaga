import { useState, useEffect } from "react";

export type NotifType = "starting_soon" | "task_ending" | "overrun" | "rebalance" | "motivational" | "forgotten" | "insight";

export interface Notif {
  id: string;
  type: NotifType;
  priority: "high" | "medium" | "low";
  read: boolean;
  dismissed: boolean;
  message: string;
  subMessage?: string;
  taskName?: string;
  taskTime?: string;
  workloadScore?: number;
  demand?: string;
  overrunMinutes?: number;
  conflictTask?: string;
  emoji?: string;
}

const initialNotifications: Notif[] = [
  {
    id: "n1", type: "starting_soon", priority: "high", read: false, dismissed: false,
    message: "Database Assignment starts in 15 minutes",
    subMessage: "You've had a high mental workload today. Consider a short break before starting.",
    taskName: "Database Assignment", taskTime: "8:00 PM – 10:00 PM",
    workloadScore: 78, demand: "High", emoji: "📚",
  },
  {
    id: "n2", type: "task_ending", priority: "high", read: false, dismissed: false,
    message: "Database Assignment was scheduled to end now",
    subMessage: "Are you finished?",
    taskName: "Database Assignment", taskTime: "8:00 PM – 10:00 PM", emoji: "⏰",
  },
  {
    id: "n3", type: "overrun", priority: "high", read: false, dismissed: false,
    message: "This task is running 30 minutes over schedule",
    subMessage: "Your Study Session starts at 10:00 PM. Continuing may affect your recovery time.",
    taskName: "Database Assignment", overrunMinutes: 30,
    conflictTask: "Study Session", emoji: "⚠️",
  },
  {
    id: "n4", type: "motivational", priority: "low", read: true, dismissed: false,
    message: "🧘 You've got a lot on your plate today.",
    subMessage: "You don't have to finish everything at once. Let's make today's load manageable.",
    emoji: "🌿",
  },
  {
    id: "n5", type: "forgotten", priority: "medium", read: false, dismissed: false,
    message: "Yesterday's Exam Revision — how did it go?",
    subMessage: "Scheduled 9:00 AM – 11:00 AM yesterday.",
    taskName: "Exam Revision", taskTime: "9:00 AM – 11:00 AM", emoji: "🤔",
  },
  {
    id: "n6", type: "insight", priority: "low", read: true, dismissed: false,
    message: "Pattern detected: Assignments take you ~30 min longer",
    subMessage: "Based on your last 4 assignments. Want to reserve a buffer next time?",
    emoji: "📊",
  },
];

class NotificationStore {
  private notifications = initialNotifications;
  private listeners = new Set<() => void>();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((l) => l());
  }

  getNotifications() {
    return this.notifications;
  }

  getUnreadCount() {
    return this.notifications.filter((n) => !n.read && !n.dismissed).length;
  }

  markRead(id: string) {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.notify();
  }

  dismiss(id: string) {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, dismissed: true } : n));
    this.notify();
  }
}

export const notificationStore = new NotificationStore();

export function useNotifications() {
  const [notifs, setNotifs] = useState(notificationStore.getNotifications());

  useEffect(() => {
    return notificationStore.subscribe(() => {
      setNotifs(notificationStore.getNotifications());
    });
  }, []);

  return {
    notifs,
    unreadCount: notificationStore.getUnreadCount(),
    markRead: (id: string) => notificationStore.markRead(id),
    dismiss: (id: string) => notificationStore.dismiss(id),
  };
}
