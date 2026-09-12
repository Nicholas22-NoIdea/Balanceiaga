import { Task, CapacityData, RebalanceOption, RebalanceChange, mockCapacity, mockTasks } from "@/lib/mockData";

/**
 * Deterministic Constraint-Solving Rebalancing Algorithm.
 * Analyzes workload bottlenecks, task priorities, categories, and flexibility
 * to generate 3 mathematically sound, realistic rebalancing strategies.
 */
export function solveAlgorithmicRebalance(
  tasks: Task[] = mockTasks,
  capacity: CapacityData = mockCapacity
): RebalanceOption[] {
  const overloadHours = Math.max(0, capacity.overloadHours || 0);
  const realisticCapacity = Math.max(1, capacity.realisticCapacity || 15);
  const totalWorkload = capacity.totalWorkload || 20;

  // Identify bottleneck days where scheduled hours exceed available hours
  const bottleneckDays = new Set(
    (capacity.weekDays || [])
      .filter((d) => d.scheduledHours > d.availableHours)
      .map((d) => d.day)
  );

  // Group tasks by category & flexibility
  const socialTasks = tasks.filter((t) => t.category === "Social" && !t.isProtected);
  const errandTasks = tasks.filter((t) => t.category === "Errands" && !t.isProtected);
  const academicTasks = tasks.filter((t) => t.category === "Academic");
  const splittableTasks = tasks.filter((t) => t.estimatedHours >= 4 && !t.isProtected);

  // -------------------------------------------------------------
  // STRATEGY A: "Academic & Priority Shield" (Recommended)
  // Protects all high-priority academic commitments; moves flexible
  // social & errand commitments out of bottleneck days, redistributes
  // heavy academic work to lighter slots.
  // -------------------------------------------------------------
  const changesA: RebalanceChange[] = [];
  let freedA = 0;

  // Move flexible social/errand tasks that sit on bottleneck days
  for (const task of [...socialTasks, ...errandTasks]) {
    const onBottleneck = task.scheduledSlots.some((s) => bottleneckDays.has(s.day));
    if (onBottleneck && freedA < overloadHours + 1) {
      const saved = Math.min(task.estimatedHours, 2);
      changesA.push({
        taskId: task.id,
        taskTitle: task.title,
        action: "MOVE",
        detail: `Reschedule to next week to clear space on ${task.scheduledSlots.map((s) => s.day).join(", ")}`,
        hoursSaved: saved,
      });
      freedA += saved;
    }
  }

  // Redistribute academic workload across under-utilized days
  const heavyAcademic = academicTasks.find((t) => !t.isProtected && t.estimatedHours >= 4);
  if (heavyAcademic) {
    const saved = 2;
    changesA.push({
      taskId: heavyAcademic.id,
      taskTitle: heavyAcademic.title,
      action: "REDISTRIBUTE",
      detail: "Spread 2 hours into morning focus slots on Friday and Saturday",
      hoursSaved: saved,
    });
    freedA += saved;
  }

  // Ensure minimum freed hours matches overload
  if (freedA < overloadHours && splittableTasks.length > 0) {
    const target = splittableTasks[0];
    if (!changesA.some((c) => c.taskId === target.id)) {
      changesA.push({
        taskId: target.id,
        taskTitle: target.title,
        action: "SPLIT",
        detail: "Split into 2 focused micro-sessions across quieter evenings",
        hoursSaved: 1,
      });
      freedA += 1;
    }
  }

  const resultingOverloadA = Math.max(0, overloadHours - freedA);
  const resultingPercentA = Math.round(
    ((totalWorkload - freedA) / realisticCapacity) * 100
  );

  const optionA: RebalanceOption = {
    id: "option-a",
    label: "Option A — Priority Shield",
    isRecommended: true,
    description:
      "Safeguards all critical academic commitments and exams. Defer flexible social & errand tasks to next week while redistributing intense study sessions to open focus slots.",
    changes: changesA.length > 0 ? changesA : [
      { taskId: "default-1", taskTitle: "Flexible Commitments", action: "MOVE", detail: "Move low-priority tasks to next week", hoursSaved: overloadHours }
    ],
    hoursFreed: freedA,
    resultingOverload: resultingOverloadA,
    resultingPercent: resultingPercentA,
    protectsHighPriority: true,
  };

  // -------------------------------------------------------------
  // STRATEGY B: "Micro-Pacing & Focus Split"
  // Keep commitments on schedule, but split multi-hour blocks into
  // manageable 1h micro-sessions and shift non-urgent tasks to weekend.
  // -------------------------------------------------------------
  const changesB: RebalanceChange[] = [];
  let freedB = 0;

  for (const task of errandTasks) {
    const saved = Math.min(task.estimatedHours, 2);
    changesB.push({
      taskId: task.id,
      taskTitle: task.title,
      action: "MOVE",
      detail: "Move to Saturday morning errand window",
      hoursSaved: saved,
    });
    freedB += saved;
    break;
  }

  for (const task of socialTasks) {
    const saved = Math.min(task.estimatedHours, 2);
    changesB.push({
      taskId: task.id,
      taskTitle: task.title,
      action: "MOVE",
      detail: "Shift by 2 days into weekend recovery slot",
      hoursSaved: saved,
    });
    freedB += saved;
    break;
  }

  if (splittableTasks.length > 0) {
    const target = splittableTasks[0];
    changesB.push({
      taskId: target.id,
      taskTitle: target.title,
      action: "SPLIT",
      detail: "Break into 1h Pomodoro blocks across Wednesday and Friday",
      hoursSaved: 1,
    });
    freedB += 1;
  }

  const resultingOverloadB = Math.max(0, overloadHours - freedB);
  const resultingPercentB = Math.round(
    ((totalWorkload - freedB) / realisticCapacity) * 100
  );

  const optionB: RebalanceOption = {
    id: "option-b",
    label: "Option B — Micro-Pacing",
    isRecommended: false,
    description:
      "Keeps all commitments within the current week by dividing long cognitive tasks into 1-hour sessions and moving errands to the weekend.",
    changes: changesB,
    hoursFreed: freedB,
    resultingOverload: resultingOverloadB,
    resultingPercent: resultingPercentB,
    protectsHighPriority: true,
  };

  // -------------------------------------------------------------
  // STRATEGY C: "Aggressive Deferral"
  // Fast relief: pushes out all flexible non-academic tasks,
  // creating maximum breathing room and buffer time.
  // -------------------------------------------------------------
  const changesC: RebalanceChange[] = [];
  let freedC = 0;

  for (const task of tasks.filter((t) => t.flexibility === "High" && !t.isProtected)) {
    const saved = task.estimatedHours;
    changesC.push({
      taskId: task.id,
      taskTitle: task.title,
      action: "MOVE",
      detail: "Postpone to next week to create emergency breathing room",
      hoursSaved: saved,
    });
    freedC += saved;
    if (freedC >= overloadHours + 2) break;
  }

  const resultingOverloadC = Math.max(0, overloadHours - freedC);
  const resultingPercentC = Math.round(
    ((totalWorkload - freedC) / realisticCapacity) * 100
  );

  const optionC: RebalanceOption = {
    id: "option-c",
    label: "Option C — Fast Relief",
    isRecommended: false,
    description:
      "Aggressively postpones all high-flexibility tasks beyond this week. Provides maximum recovery time and mental clarity for urgent deliverables.",
    changes: changesC,
    hoursFreed: freedC,
    resultingOverload: resultingOverloadC,
    resultingPercent: resultingPercentC,
    protectsHighPriority: false,
  };

  return [optionA, optionB, optionC];
}

/**
 * Calls Google Gemini (or external LLM) to generate personalized, empathetic
 * AI rebalance options. If the API key is not configured, blocked, or fails,
 * it seamlessly falls back to the deterministic constraint-solving algorithm.
 */
export async function fetchAIRebalanceSuggestions(
  tasks: Task[] = mockTasks,
  capacity: CapacityData = mockCapacity
): Promise<{ options: RebalanceOption[]; isAIPowered: boolean }> {
  const algorithmicOptions = solveAlgorithmicRebalance(tasks, capacity);

  // Check for any provided API keys
  const geminiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.AI_REBALANCE_API_KEY;

  if (!geminiKey) {
    return { options: algorithmicOptions, isAIPowered: false };
  }

  const prompt = `You are Balanceiaga's intelligent student cognitive workload advisor.
Analyze the following user schedule, capacity, and current overload:
- Realistic Capacity: ${capacity.realisticCapacity}h
- Total Workload: ${capacity.totalWorkload}h
- Overload: ${capacity.overloadHours}h (${capacity.overloadPercent}%)
- Current Tasks:
${tasks.map((t) => `  * [${t.category}] ${t.title} (${t.estimatedHours}h, Priority: ${t.priority}, Flexibility: ${t.flexibility}, Protected: ${t.isProtected})`).join("\n")}

Return a JSON array containing 3 distinct rebalancing options matching this exact TypeScript structure:
[
  {
    "id": "ai-option-a",
    "label": "Option A — Academic Shield",
    "isRecommended": true,
    "description": "Engaging empathetic 1-2 sentence rationale",
    "changes": [
      {
        "taskId": "task-id",
        "taskTitle": "Task Name",
        "action": "MOVE" | "SPLIT" | "REDISTRIBUTE" | "KEEP",
        "detail": "Actionable rescheduling advice",
        "hoursSaved": 2
      }
    ],
    "hoursFreed": 5,
    "resultingOverload": 0,
    "resultingPercent": 100,
    "protectsHighPriority": true
  }
]
Output ONLY valid JSON without markdown wrapping.`;

  try {
    // 1. Try Gemini generateContent endpoint
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000,
          responseMimeType: "application/json",
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { options: parsed as RebalanceOption[], isAIPowered: true };
        }
      }
    } else {
      console.warn("Gemini API returned status:", response.status, "Falling back to algorithmic solver.");
    }
  } catch (err) {
    console.warn("AI rebalance call failed; using algorithmic solver fallback:", err);
  }

  // Graceful fallback to deterministic algorithmic solver
  return { options: algorithmicOptions, isAIPowered: false };
}
