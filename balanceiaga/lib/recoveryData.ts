export type RecoveryCategory = "Mind" | "Body" | "Fun" | "Environment" | "Social" | "Rest";

export interface RecoveryActivity {
  id: string;
  title: string;
  category: RecoveryCategory;
  durationMinutes: number;
  emoji: string;
  description: string;
  bestFor: ("Mental" | "Physical" | "Social" | "Time Pressure")[];
}

export const recoveryCatalog: RecoveryActivity[] = [
  // Mind
  { id: "r1", title: "Breathing Exercise", category: "Mind", durationMinutes: 5, emoji: "🧘", description: "Box breathing to lower heart rate", bestFor: ["Mental", "Time Pressure"] },
  { id: "r2", title: "Guided Meditation", category: "Mind", durationMinutes: 15, emoji: "🎧", description: "Listen to a short guided session", bestFor: ["Mental", "Social"] },
  { id: "r3", title: "Music Break", category: "Mind", durationMinutes: 10, emoji: "🎵", description: "Listen to your favorite playlist", bestFor: ["Mental", "Social"] },
  // Body
  { id: "r4", title: "Light Stretching", category: "Body", durationMinutes: 10, emoji: "🧘", description: "Release muscle tension", bestFor: ["Physical", "Mental"] },
  { id: "r5", title: "Hydration Break", category: "Body", durationMinutes: 5, emoji: "💧", description: "Drink a large glass of water", bestFor: ["Physical", "Time Pressure"] },
  { id: "r6", title: "Short Walk", category: "Body", durationMinutes: 15, emoji: "🚶", description: "Walk around the block", bestFor: ["Mental", "Physical"] },
  // Fun
  { id: "r7", title: "Relaxing Game", category: "Fun", durationMinutes: 15, emoji: "🎮", description: "Play a casual, low-stakes game", bestFor: ["Mental", "Social"] },
  { id: "r8", title: "Personal Hobby", category: "Fun", durationMinutes: 20, emoji: "🎨", description: "Spend time on something you love", bestFor: ["Social", "Mental"] },
  // Environment
  { id: "r9", title: "Get Fresh Air", category: "Environment", durationMinutes: 10, emoji: "🌳", description: "Step outside and detach", bestFor: ["Mental", "Physical"] },
  { id: "r10", title: "Screen-Free Break", category: "Environment", durationMinutes: 15, emoji: "📵", description: "Close the laptop and look away", bestFor: ["Mental"] },
  // Social
  { id: "r11", title: "Call a Friend", category: "Social", durationMinutes: 20, emoji: "📞", description: "Catch up with someone close", bestFor: ["Mental"] }, // Good for lonely mental work
  // Rest
  { id: "r12", title: "Power Nap", category: "Rest", durationMinutes: 20, emoji: "😴", description: "Close your eyes and reset", bestFor: ["Physical", "Mental"] },
  { id: "r13", title: "Quiet Time", category: "Rest", durationMinutes: 15, emoji: "🛋️", description: "Sit in a quiet space with no input", bestFor: ["Social", "Mental"] }
];

export type RecoveryNeedLevel = "None" | "Suggested" | "Recommended" | "Strongly Needed";

export interface StudentContext {
  workloadScore: number;
  continuousWorkMinutes: number;
  minutesSinceLastBreak: number;
  dominantLoadType: "Mental" | "Physical" | "Social" | "Time Pressure";
  minutesUntilNextTask: number;
  consecutiveDemandingTasks: number;
}

export function evaluateRecoveryNeed(ctx: StudentContext): RecoveryNeedLevel {
  if (ctx.workloadScore > 90 || ctx.continuousWorkMinutes > 180 || ctx.consecutiveDemandingTasks >= 4) {
    return "Strongly Needed";
  }
  
  if (ctx.continuousWorkMinutes > 120 || ctx.consecutiveDemandingTasks >= 3) {
    return "Recommended";
  }

  if (ctx.continuousWorkMinutes > 60 && ctx.minutesUntilNextTask >= 15) {
    return "Suggested";
  }

  return "None";
}

export function getRecommendedActivities(ctx: StudentContext, limit: number = 3): RecoveryActivity[] {
  // If time pressure is high (<= 15 mins available), force "Time Pressure" category regardless of dominant load
  const targetLoad = ctx.minutesUntilNextTask <= 15 ? "Time Pressure" : ctx.dominantLoadType;
  
  const suitable = recoveryCatalog.filter(a => 
    a.bestFor.includes(targetLoad) && 
    a.durationMinutes <= ctx.minutesUntilNextTask
  );

  // If no exact match (very short time), fallback to absolute shortest tasks
  if (suitable.length === 0) {
    return recoveryCatalog
      .filter(a => a.durationMinutes <= 5)
      .slice(0, limit);
  }

  return suitable.slice(0, limit);
}
