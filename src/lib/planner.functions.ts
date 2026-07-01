import { createServerFn } from "@tanstack/react-start";

export type ItineraryDay = {
  day: number;
  city: string;
  tag: string;
  title: string;
  description: string;
  morning: string;
  afternoon: string;
  evening: string;
  imageQuery: string;
};

export type Itinerary = {
  destination: string;
  summary: string;
  bestTime: string;
  weather: string;
  estimatedBudgetUSD: number;
  budgetBreakdown: { stay: number; food: number; transport: number; activities: number; misc: number };
  cities: string[];
  hotels: { name: string; city: string; vibe: string; pricePerNightUSD: number }[];
  restaurants: { name: string; city: string; cuisine: string }[];
  attractions: { name: string; city: string; type: string }[];
  hiddenGems: { name: string; city: string; why: string }[];
  days: ItineraryDay[];
};

type PlanInput = {
  destination: string;
  days: number;
  budgetUSD: number;
  interests: string[];
  groupType: string;
  transport: string;
  origin?: string;
  tripMode?: "direct" | "scenic";
};

export const generateItinerary = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown): PlanInput => {
    const i = raw as Partial<PlanInput>;
    const destination = (i.destination ?? "").toString().trim();
    if (!destination) throw new Error("Destination is required");
    if (destination.length > 200) throw new Error("Destination too long");
    const days = Math.min(30, Math.max(1, Number(i.days) || 5));
    const budgetUSD = Math.min(100000, Math.max(100, Number(i.budgetUSD) || 2000));
    const interests = Array.isArray(i.interests) ? i.interests.slice(0, 12).map(String) : [];
    const groupType = (i.groupType ?? "solo").toString().slice(0, 40);
    const transport = (i.transport ?? "mixed").toString().slice(0, 60);
    const origin = i.origin ? i.origin.toString().slice(0, 200).trim() : undefined;
    const tripMode: "direct" | "scenic" = i.tripMode === "scenic" ? "scenic" : "direct";
    return { destination, days, budgetUSD, interests, groupType, transport, origin, tripMode };
  })
  .handler(async ({ data }): Promise<Itinerary> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const sys = `You are a senior world-travel concierge. You design realistic, vivid, day-by-day trip plans for ANY destination on Earth — a city, country, region, island, landmark, or multi-country tour. Output STRICT JSON only, no prose, no markdown.`;

    const routingLine = data.origin
      ? data.tripMode === "scenic"
        ? `- Starting point: ${data.origin}. Build a SCENIC route from here to ${data.destination}: include 2-4 worthwhile tourist stops along the natural travel path (cities, viewpoints, cultural sites) as intermediate cities/days. Do NOT skip the final destination.`
        : `- Starting point: ${data.origin}. Route directly to ${data.destination} (minimal detours). Include a short travel day if the distance requires it.`
      : `- No starting point provided — plan the trip in-destination.`;

    const user = `Plan a trip with these inputs:
- Destination: ${data.destination}
- Duration: ${data.days} days
- Total budget: ${data.budgetUSD} USD
- Interests: ${data.interests.join(", ") || "general"}
- Group: ${data.groupType}
- Transport: ${data.transport}
${routingLine}

Return JSON exactly matching this TypeScript type:
{
  "destination": string,
  "summary": string,
  "bestTime": string,
  "weather": string,
  "estimatedBudgetUSD": number,
  "budgetBreakdown": { "stay": number, "food": number, "transport": number, "activities": number, "misc": number },
  "cities": string[],
  "hotels": [{ "name": string, "city": string, "vibe": string, "pricePerNightUSD": number }],
  "restaurants": [{ "name": string, "city": string, "cuisine": string }],
  "attractions": [{ "name": string, "city": string, "type": string }],
  "hiddenGems": [{ "name": string, "city": string, "why": string }],
  "days": [{
    "day": number, "city": string, "tag": string, "title": string, "description": string,
    "morning": string, "afternoon": string, "evening": string, "imageQuery": string
  }]
}

Rules:
- Generate exactly ${data.days} day objects, numbered 1..${data.days}.
- Use REAL place names, neighborhoods, dishes, and landmarks.
- If a starting point is provided, include it as cities[0] and start day 1 there.
- Tailor activities to interests and group type.
- Keep all money values in USD. Output STRICT JSON only.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit — please wait a moment and try again.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to continue.");
      throw new Error(`AI error ${res.status}: ${text.slice(0, 300)}`);
    }
    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = json.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as Itinerary;
    if (!Array.isArray(parsed.days) || parsed.days.length === 0) {
      throw new Error("AI returned an invalid itinerary. Try again.");
    }
    return parsed;
  });
