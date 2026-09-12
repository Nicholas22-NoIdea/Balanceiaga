import { google } from "googleapis";

/**
 * Build a calendar client for the logged‑in user using the OAuth access token.
 */
export function buildCalendarClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.calendar({ version: "v3", auth });
}

/**
 * Fetch upcoming events for the signed‑in user.
 */
export async function getUpcomingEventsForUser(
  accessToken: string,
  calendarId = "primary",
  maxResults = 10,
): Promise<any[]> {
  const client = buildCalendarClient(accessToken);
  const now = new Date().toISOString();
  const res = await client.events.list({
    calendarId,
    timeMin: now,
    maxResults,
    singleEvents: true,
    orderBy: "startTime",
  });
  return res.data.items ?? [];
}
