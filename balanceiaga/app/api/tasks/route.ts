import { NextResponse } from "next/server";
import { mockTasks } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({ tasks: mockTasks });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newTask = {
    id: `task-${Date.now()}`,
    ...body,
    status: "pending",
    scheduledSlots: [],
  };
  return NextResponse.json({ task: newTask, message: "Task added. Capacity recalculated." });
}
