import { RebalanceOption } from "@/lib/mockData";

/**
 * Calls an external LLM (e.g., OpenAI or Gemini) to generate rebalance suggestions.
 * The function expects an array of existing rebalance options and returns
 * an array of new options that match the `RebalanceOption` shape used in the app.
 *
 * Configuration via environment variables:
 *   AI_REBALANCE_ENDPOINT – full HTTP URL of the LLM API
 *   AI_REBALANCE_API_KEY   – secret key for authentication
 *   AI_REBALANCE_MODEL     – model identifier (defaults to a lightweight model)
 */
export async function fetchAIRebalanceSuggestions(
  existingOptions: RebalanceOption[]
): Promise<RebalanceOption[]> {
  const endpoint = process.env.AI_REBALANCE_ENDPOINT;
  const apiKey = process.env.AI_REBALANCE_API_KEY;
  const model = process.env.AI_REBALANCE_MODEL || "gemini-1.5-flash";

  if (!endpoint || !apiKey) {
    console.warn("AI rebalance: endpoint or API key not configured – skipping AI suggestions");
    return [];
  }

  const prompt = `You are a personal scheduling assistant. Given the following rebalance options, suggest one or more alternative options that improve the schedule while respecting flexibility and minimizing consequences. Respond with a JSON array of objects having the same shape as the input (id, label, isRecommended, description, changes, hoursFreed, resultingOverload, resultingPercent, protectsHighPriority).\n\nInput options: ${JSON.stringify(existingOptions)}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error("AI rebalance request failed:", response.status, await response.text());
      return [];
    }

    const data = await response.json();
    let content: string | undefined;
    if (data.choices?.[0]?.message?.content) {
      content = data.choices[0].message.content;
    } else if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      content = data.candidates[0].content.parts[0].text;
    }
    if (!content) {
      console.warn("AI rebalance: could not locate LLM response content");
      return [];
    }
    const parsed = JSON.parse(content.trim());
    return Array.isArray(parsed) ? (parsed as RebalanceOption[]) : [];
  } catch (err) {
    console.error("AI rebalance error:", err);
    return [];
  }
}
