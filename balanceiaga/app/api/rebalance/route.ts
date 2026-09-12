import { NextResponse } from "next/server";
import { mockRebalanceOptions } from "@/lib/mockData";
import { fetchAIRebalanceSuggestions } from "@/lib/aiRebalance";
import { RebalanceOption } from "@/lib/mockData";

export async function GET() {
  // Retrieve AI‑generated rebalance suggestions (may be empty if not configured)
  const aiOptions = await fetchAIRebalanceSuggestions(mockRebalanceOptions as RebalanceOption[]);
  const combined = [...mockRebalanceOptions, ...aiOptions];
  return NextResponse.json({ options: combined });
}
