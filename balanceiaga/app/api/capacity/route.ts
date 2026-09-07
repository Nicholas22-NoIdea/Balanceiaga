import { NextResponse } from "next/server";
import { mockCapacity } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(mockCapacity);
}
