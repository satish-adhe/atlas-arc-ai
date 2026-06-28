import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search, MapPin, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import destTokyo from "@/assets/dest-tokyo.jpg";
import destKyoto from "@/assets/dest-kyoto.jpg";
import destNorway from "@/assets/dest-norway.jpg";
import destSantorini from "@/assets/dest-santorini.jpg";
import destBali from "@/assets/dest-bali.jpg";
import destMarrakech from "@/assets/dest-marrakech.jpg";
import { aiSearchDestination, type AiDestination } from "@/lib/explorer.functions";

export const Route = createFileRoute("/explorer")({
  head: () => ({
    meta: [
      { title: "Destination Explorer — TripGenius AI" },
      { name: "description", content: "AI-powered worldwide destination discovery — search any place on Earth and get instant inspiration." },
      { property: "og:title", content: "Destination Explorer — TripGenius AI" },
      { property: "og:description", content: "Search any place on Earth and get instant AI-curated trip ideas." },
    ],
  }),
  component: Explorer,
});

type Card = {
  name: string;
  country: string;
  img: string;
  tag: string;
  days: number;
  price: number;
  rating: number;
  ai?: boolean;
  summary?: string;
};

const seed: Card[] = [
  { name: "Tokyo", country: "Japan", img: destTokyo, tag: "Urban", days: 7, price: 2840, rating: 4.9 },
  { name: "Kyoto", country: "Japan", img: destKyoto, tag: "Cultural", days: 5, price: 1920, rating: 4.8 },
  { name: "Geirangerfjord", country: "Norway", img: destNorway, tag: "Nature", days: 8, price: 3640, rating: 4.9 },
  { name: "Santorini", country: "Greece", img: destSantorini, tag: "Coastal", days: 6, price: 2210, rating: 4.7 },
  { name: "Ubud", country: "Bali", img: destBali, tag: "Wellness", days: 10, price: 1580, rating: 4.8 },
  { name: "Marrakech", country: "Morocco", img: destMarrakech, tag: "Cultural", days: 7, price: 1740, rating: 4.6 },
];
const tags = ["All", "Urban", "Nature", "Coastal", "Cultural", "Wellness"];

async function fetchWikiImage(title: string): Promise<string | null> {
  try {
    const r = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { headers: { Accept: "application/json" } }
    );
    if (!r.ok) return null;
    const j = (await r.json()) as { originalimage?: { source?: string }; thumbnail?: { source?: string } };
    return j.originalimage?.source ?? j.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

function Explorer() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("All");
  const [aiCards, setAiCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const callAi = useServerFn(aiSearchDestination);

  const all = [...aiCards, ...seed];
  const filtered = all.filter(
    (d) =>
      (tag === "All" || d.tag === tag) &&
      (d.name.toLowerCase().includes(q.toLowerCase()) ||
        d.country.toLowerCase().includes(q.toLowerCase()) ||
        d.ai)
  );

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const ai: AiDestination = await callAi({ data: { query: q.trim() } });
      const img =
        (await fetchWikiImage(ai.name)) ??
        (await fetchWikiImage(`${ai.name}, ${ai.country}`)) ??
        `https://source.unsplash.com/1024x768/?${encodeURIComponent(ai.imageQuery || ai.name)}`;
      setAiCards((prev) => [
        { ...ai, img, ai: true },
        ...prev.filter((c) => c.name !== ai.name),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell>
      <PageHeader
        eyebrow="AI Explorer"
        title="Every place on Earth, one search away."
        subtitle="Type any city, region, landmark, or vibe — anywhere in the world. Our AI curates it instantly with a live image."
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <form onSubmit={onSearch} className="glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex-1 flex items-center gap-3 px-4">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try “Patagonia”, “hidden island in Thailand”, or “Reykjavík”"
              className="w-full bg-transparent outline-none py-3"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !q.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-azure text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Curating…" : "AI Search"}
          </button>
        </form>
        {error && <div className="text-xs text-red-400 mb-4 px-2">{error}</div>}

        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${tag === t ? "bg-azure border-azure text-white" : "border-hairline text-muted-foreground hover:text-foreground hover:border-foreground/40"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading && (
            <div className="glass rounded-3xl overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-surface-strong" />
              <div className="p-5 space-y-2">
                <div className="h-3 w-20 bg-surface-strong rounded" />
                <div className="h-5 w-40 bg-surface-strong rounded" />
              </div>
            </div>
          )}
          {filtered.map((d) => (
            <Link
              to="/planner"
              key={`${d.name}-${d.ai ? "ai" : "seed"}`}
              className="group glass rounded-3xl overflow-hidden hover:bg-surface-strong transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={d.img}
                  alt={d.name}
                  loading="lazy"
                  className="size-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://source.unsplash.com/1024x768/?${encodeURIComponent(d.name + ",travel")}`;
                  }}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-strong text-[10px] font-bold uppercase tracking-widest">{d.tag}</div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass-strong text-xs font-semibold">★ {d.rating}</div>
                {d.ai && (
                  <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-azure text-white text-[10px] font-bold uppercase tracking-widest">
                    <Sparkles className="size-3" /> AI Pick
                  </div>
                )}
              </div>
              <div className="p-5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] text-azure font-bold uppercase tracking-widest flex items-center gap-1"><MapPin className="size-3" /> {d.country}</div>
                  <h3 className="text-xl font-display font-semibold mt-1 truncate">{d.name}</h3>
                  <div className="text-xs text-muted-foreground mt-1">{d.days} days · from ${d.price.toLocaleString()}</div>
                  {d.summary && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{d.summary}</p>}
                </div>
                <div className="size-10 shrink-0 rounded-full glass grid place-items-center group-hover:bg-azure group-hover:border-azure transition-colors">
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
