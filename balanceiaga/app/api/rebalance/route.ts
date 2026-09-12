import { NextRequest, NextResponse } from "next/server";
import { mockCapacity, mockTasks } from "@/lib/mockData";
import { fetchAIRebalanceSuggestions, solveAlgorithmicRebalance } from "@/lib/aiRebalance";

export async function GET() {
  try {
    const { options, isAIPowered } = await fetchAIRebalanceSuggestions(mockTasks, mockCapacity);
    return NextResponse.json({
      options,
      isAIPowered,
      capacity: mockCapacity,
    });
  } catch (error) {
    console.error("Failed to generate rebalance options:", error);
    const fallbackOptions = solveAlgorithmicRebalance(mockTasks, mockCapacity);
    return NextResponse.json({
      options: fallbackOptions,
      isAIPowered: false,
      capacity: mockCapacity,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const tasks = body.tasks || mockTasks;
    const capacity = body.capacity || mockCapacity;

    const { options, isAIPowered } = await fetchAIRebalanceSuggestions(tasks, capacity);
    return NextResponse.json({
      options,
      isAIPowered,
      capacity,
    });
  } catch (error) {
    console.error("Rebalance POST error:", error);
    const fallbackOptions = solveAlgorithmicRebalance(mockTasks, mockCapacity);
    return NextResponse.json({
      options: fallbackOptions,
      isAIPowered: false,
      capacity: mockCapacity,
    });
  }
}
