import { NextResponse } from "next/server";
import { getUpcomingEventsForUser } from "@/lib/googleCalendar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  // Retrieve the user session (contains OAuth access token)
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "Not authenticated. Please sign in with Google." },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const calendarId = searchParams.get("calendarId") ?? "primary";

  try {
    const events = await getUpcomingEventsForUser(session.accessToken, calendarId, 20);
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Google Calendar fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 },
    );
  }
}
