export type MentalDemand = "Low" | "Medium" | "High";
export type Flexibility = "Fixed" | "Can Move" | "Flexible";
export type ConsequenceOfDelay = "Minor" | "Moderate" | "Critical";

export interface Subtask {
  name: string;
  hours: number;
  emoji: string;
}

export function simulateAIBreakdown(description: string): {
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

export function computeWorkloadScore(hours: number, demand: MentalDemand, consequence: ConsequenceOfDelay, flexibility: Flexibility): number {
  const demandMultiplier = demand === "High" ? 2.5 : demand === "Medium" ? 1.5 : 1;
  const consequenceBonus = consequence === "Critical" ? 10 : consequence === "Moderate" ? 5 : 0;
  const flexPenalty = flexibility === "Fixed" ? 5 : flexibility === "Can Move" ? 2 : 0;
  return Math.round(hours * demandMultiplier * 2 + consequenceBonus + flexPenalty);
}
