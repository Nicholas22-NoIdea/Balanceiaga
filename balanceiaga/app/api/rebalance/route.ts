import { NextResponse } from "next/server";
import { mockRebalanceOptions } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({ options: mockRebalanceOptions });
}
