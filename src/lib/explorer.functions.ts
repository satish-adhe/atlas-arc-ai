import { createServerFn } from "@tanstack/react-start";

export type AiDestination = {
  name: string;
  country: string;
  tag: "Urban" | "Nature" | "Coastal" | "Cultural" | "Wellness";
  days: number;
  price: number;
  rating: number;
  summary: string;
  imageQuery: string;
};

export const aiSearchDestination = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const q = (input as { query?: string })?.query?.toString().trim() ?? "";
    if (!q) throw new Error("Query is required");
    if (q.length > 120) throw new Error("Query too long");
    return { query: q };
  })
  .handler(async ({ data }): Promise<AiDestination> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a world travel curator. For any user query (city, region, country, vibe, or landmark anywhere in the world), respond with a single JSON object describing one specific real destination. No prose, no markdown.",
          },
          {
            role: "user",
            content: `Query: "${data.query}". Return JSON exactly: {"name":string,"country":string,"tag":"Urban"|"Nature"|"Coastal"|"Cultural"|"Wellness","days":number(3-14),"price":number(USD 800-6000),"rating":number(4.3-5.0,one decimal),"summary":string(<=140 chars),"imageQuery":string(2-4 evocative english words for an image search of this place)}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit — try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits to continue.");
      throw new Error(`AI error ${res.status}: ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = json.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as AiDestination;
    return parsed;
  });
