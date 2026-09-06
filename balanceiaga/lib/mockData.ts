// Mock data for Balanceiaga hackathon MVP
export type Category = "Academic" | "Social" | "Errands" | "Other";
export type Priority = "High" | "Medium" | "Low";
export type Flexibility = "Low" | "Medium" | "High";
export type RebalanceAction = "MOVE" | "SPLIT" | "REDISTRIBUTE" | "KEEP";
export type TaskStatus = "pending" | "in-progress" | "done" | "overdue";

export interface Task {
  id: string;
  title: string;
  category: Category;
  deadline: string;
  estimatedHours: number;
  sessions: number;
  sessionDuration: number;
  priority: Priority;
  flexibility: Flexibility;
  isProtected: boolean;
  status: TaskStatus;
  scheduledSlots: ScheduledSlot[];
}

export interface ScheduledSlot {
  day: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface CapacityData {
  availableTime: number;
  fixedCommitments: number;
  protectedTime: number;
  buffer: number;
  realisticCapacity: number;
  totalWorkload: number;
  overloadHours: number;
  overloadPercent: number;
  isOverloaded: boolean;
  weekDays: WeekDay[];
}

export interface WeekDay {
  day: string;
  date: string;
  availableHours: number;
  scheduledHours: number;
  isOverloaded: boolean;
}

export interface CategoryLoad {
  category: Category;
  hours: number;
  color: string;
  bgColor: string;
}

export interface RebalanceOption {
  id: string;
  label: string;
  isRecommended: boolean;
  description: string;
  changes: RebalanceChange[];
  hoursFreed: number;
  resultingOverload: number;
  resultingPercent: number;
  protectsHighPriority: boolean;
}

export interface RebalanceChange {
  taskId: string;
  taskTitle: string;
  action: RebalanceAction;
  detail: string;
  hoursSaved: number;
}

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Database Assignment",
    category: "Academic",
    deadline: "2026-09-10",
    estimatedHours: 8,
    sessions: 4,
    sessionDuration: 2,
    priority: "High",
    flexibility: "Medium",
    isProtected: false,
    status: "in-progress",
    scheduledSlots: [
      { day: "Mon", date: "2026-09-07", startTime: "10:00", endTime: "12:00" },
      { day: "Wed", date: "2026-09-09", startTime: "14:00", endTime: "16:00" },
      { day: "Thu", date: "2026-09-10", startTime: "10:00", endTime: "12:00" },
      { day: "Fri", date: "2026-09-11", startTime: "10:00", endTime: "12:00" },
    ],
  },
  {
    id: "task-2",
    title: "Exam Revision",
    category: "Academic",
    deadline: "2026-09-12",
    estimatedHours: 4,
    sessions: 2,
    sessionDuration: 2,
    priority: "High",
    flexibility: "Low",
    isProtected: true,
    status: "pending",
    scheduledSlots: [
      { day: "Tue", date: "2026-09-08", startTime: "09:00", endTime: "11:00" },
      { day: "Thu", date: "2026-09-10", startTime: "14:00", endTime: "16:00" },
    ],
  },
  {
    id: "task-3",
    title: "Club Meeting",
    category: "Social",
    deadline: "2026-09-09",
    estimatedHours: 2,
    sessions: 1,
    sessionDuration: 2,
    priority: "Medium",
    flexibility: "High",
    isProtected: false,
    status: "pending",
    scheduledSlots: [
      { day: "Wed", date: "2026-09-09", startTime: "18:00", endTime: "20:00" },
    ],
  },
  {
    id: "task-4",
    title: "Grocery Run",
    category: "Errands",
    deadline: "2026-09-08",
    estimatedHours: 2,
    sessions: 1,
    sessionDuration: 2,
    priority: "Low",
    flexibility: "High",
    isProtected: false,
    status: "pending",
    scheduledSlots: [
      { day: "Mon", date: "2026-09-07", startTime: "16:00", endTime: "18:00" },
    ],
  },
  {
    id: "task-5",
    title: "Research Paper Draft",
    category: "Academic",
    deadline: "2026-09-13",
    estimatedHours: 6,
    sessions: 3,
    sessionDuration: 2,
    priority: "High",
    flexibility: "Medium",
    isProtected: false,
    status: "pending",
    scheduledSlots: [
      { day: "Tue", date: "2026-09-08", startTime: "14:00", endTime: "16:00" },
      { day: "Wed", date: "2026-09-09", startTime: "10:00", endTime: "12:00" },
      { day: "Fri", date: "2026-09-11", startTime: "14:00", endTime: "16:00" },
    ],
  },
  {
    id: "task-6",
    title: "Lunch with Friends",
    category: "Social",
    deadline: "2026-09-07",
    estimatedHours: 2,
    sessions: 1,
    sessionDuration: 2,
    priority: "Medium",
    flexibility: "High",
    isProtected: false,
    status: "pending",
    scheduledSlots: [
      { day: "Mon", date: "2026-09-07", startTime: "12:00", endTime: "14:00" },
    ],
  },
];

export const mockCapacity: CapacityData = {
  availableTime: 20,
  fixedCommitments: 5,
  protectedTime: 2,
  buffer: 2,
  realisticCapacity: 11,
  totalWorkload: 16,
  overloadHours: 5,
  overloadPercent: 145,
  isOverloaded: true,
  weekDays: [
    { day: "Mon", date: "2026-09-07", availableHours: 4, scheduledHours: 6, isOverloaded: true },
    { day: "Tue", date: "2026-09-08", availableHours: 4, scheduledHours: 4, isOverloaded: false },
    { day: "Wed", date: "2026-09-09", availableHours: 4, scheduledHours: 6, isOverloaded: true },
    { day: "Thu", date: "2026-09-10", availableHours: 2, scheduledHours: 4, isOverloaded: true },
    { day: "Fri", date: "2026-09-11", availableHours: 4, scheduledHours: 4, isOverloaded: false },
    { day: "Sat", date: "2026-09-12", availableHours: 2, scheduledHours: 2, isOverloaded: false },
    { day: "Sun", date: "2026-09-13", availableHours: 0, scheduledHours: 0, isOverloaded: false },
  ],
};

export const mockCategoryLoads: CategoryLoad[] = [
  { category: "Academic", hours: 10, color: "#6C63FF", bgColor: "#EEF0FF" },
  { category: "Social",   hours: 4,  color: "#FF6B9D", bgColor: "#FFF0F5" },
  { category: "Errands",  hours: 2,  color: "#FF7043", bgColor: "#FFF3F0" },
  { category: "Other",    hours: 0,  color: "#00C9B1", bgColor: "#F0FDFA" },
];

export const mockRebalanceOptions: RebalanceOption[] = [
  {
    id: "option-a",
    label: "Option A",
    isRecommended: true,
    description: "Move your Club Meeting and redistribute Database work. Protects all high-priority academic commitments.",
    changes: [
      { taskId: "task-3", taskTitle: "Club Meeting", action: "MOVE", detail: "Move to next week (Sep 16)", hoursSaved: 2 },
      { taskId: "task-1", taskTitle: "Database Assignment", action: "REDISTRIBUTE", detail: "Spread remaining 2h across Mon & Fri morning slots", hoursSaved: 2 },
      { taskId: "task-5", taskTitle: "Research Paper Draft", action: "SPLIT", detail: "Break into 3 × 1h micro-sessions", hoursSaved: 1 },
    ],
    hoursFreed: 5,
    resultingOverload: 0,
    resultingPercent: 100,
    protectsHighPriority: true,
  },
  {
    id: "option-b",
    label: "Option B",
    isRecommended: false,
    description: "Move Grocery Run and reschedule Lunch with Friends. Keeps academic and club commitments untouched.",
    changes: [
      { taskId: "task-4", taskTitle: "Grocery Run", action: "MOVE", detail: "Move to next Monday (Sep 14)", hoursSaved: 2 },
      { taskId: "task-6", taskTitle: "Lunch with Friends", action: "MOVE", detail: "Move to Saturday (Sep 12)", hoursSaved: 2 },
      { taskId: "task-1", taskTitle: "Database Assignment", action: "REDISTRIBUTE", detail: "Spread 1h to Friday afternoon", hoursSaved: 1 },
    ],
    hoursFreed: 5,
    resultingOverload: 0,
    resultingPercent: 98,
    protectsHighPriority: true,
  },
  {
    id: "option-c",
    label: "Option C",
    isRecommended: false,
    description: "Reduce social commitments and split the Research Paper into smaller sessions across the weekend.",
    changes: [
      { taskId: "task-3", taskTitle: "Club Meeting", action: "MOVE", detail: "Move to next week", hoursSaved: 2 },
      { taskId: "task-6", taskTitle: "Lunch with Friends", action: "MOVE", detail: "Move to Sunday (Sep 13)", hoursSaved: 2 },
      { taskId: "task-5", taskTitle: "Research Paper Draft", action: "SPLIT", detail: "Move 1h to Saturday morning", hoursSaved: 1 },
    ],
    hoursFreed: 5,
    resultingOverload: 0,
    resultingPercent: 96,
    protectsHighPriority: false,
  },
];
