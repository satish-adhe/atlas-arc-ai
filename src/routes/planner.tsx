import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { useState } from "react";
import { Sparkles, MapPin, Calendar, Wallet, Heart, ArrowRight, Loader2 } from "lucide-react";
import destTokyo from "@/assets/dest-tokyo.jpg";
import destKyoto from "@/assets/dest-kyoto.jpg";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Trip Planner — TripGenius AI" },
      { name: "description", content: "Tell us your dream trip. Our AI builds a personalized day-by-day itinerary in seconds." },
      { property: "og:title", content: "AI Trip Planner — TripGenius AI" },
      { property: "og:description", content: "Personalized itineraries built by AI from your budget, interests, and duration." },
    ],
  }),
  component: Planner,
});

const interests = ["Food", "Nature", "History", "Nightlife", "Architecture", "Adventure", "Wellness", "Art"];

function Planner() {
  const [destination, setDestination] = useState("Tokyo & Kyoto");
  const [days, setDays] = useState(7);
  const [budget, setBudget] = useState(3000);
  const [selected, setSelected] = useState<string[]>(["Food", "History"]);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = (i: string) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const generate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setGenerated(true); }, 1400);
  };

  return (
    <SiteShell>
      <PageHeader
        eyebrow="AI Planner"
        title="Compose your next journey."
        subtitle="Tell TripGenius your destination, dates, budget, and what you love. The engine returns a curated day-by-day itinerary instantly."
      />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-12 gap-8">
        {/* Form */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="glass rounded-3xl p-6 space-y-6">
            <Field icon={MapPin} label="Destination">
              <input value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-transparent outline-none text-lg font-medium" />
            </Field>
            <Field icon={Calendar} label="Duration">
              <div className="flex items-center gap-4">
                <input type="range" min={2} max={21} value={days} onChange={(e) => setDays(+e.target.value)} className="flex-1 accent-azure" />
                <span className="text-lg font-semibold w-16 text-right">{days} days</span>
              </div>
            </Field>
            <Field icon={Wallet} label="Budget (USD)">
              <div className="flex items-center gap-4">
                <input type="range" min={500} max={15000} step={100} value={budget} onChange={(e) => setBudget(+e.target.value)} className="flex-1 accent-azure" />
                <span className="text-lg font-semibold w-24 text-right">${budget.toLocaleString()}</span>
              </div>
            </Field>
            <Field icon={Heart} label="Interests">
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <button
                    key={i}
                    onClick={() => toggle(i)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      selected.includes(i)
                        ? "bg-azure text-white border-azure"
                        : "bg-transparent border-hairline text-muted-foreground hover:text-foreground hover:border-foreground/40"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </Field>

            <button
              onClick={generate}
              disabled={loading}
              className="w-full bg-azure hover:bg-azure-glow text-white py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <><Loader2 className="size-4 animate-spin" /> Composing itinerary…</> : <><Sparkles className="size-4" /> Generate Itinerary</>}
            </button>
          </div>

          <div className="glass rounded-3xl p-6 text-sm text-muted-foreground">
            <div className="text-xs font-bold uppercase tracking-widest text-azure mb-3">Tip</div>
            Be specific in your destination — "Tokyo &amp; coastal Kyushu" yields a richer itinerary than "Japan".
          </div>
        </div>

        {/* Result */}
        <div className="col-span-12 lg:col-span-7">
          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="glass rounded-3xl p-6 h-40 animate-pulse" />
              ))}
            </div>
          ) : generated ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">{destination}</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-lg glass text-xs">{days} Days</span>
                  <span className="px-3 py-1.5 rounded-lg glass text-xs">${budget.toLocaleString()} est.</span>
                </div>
              </div>
              {sampleItinerary(days).map((d) => (
                <div key={d.day} className="glass rounded-3xl p-6 hover:bg-surface-strong transition-all">
                  <div className="flex gap-5">
                    <div className="w-40 h-32 rounded-2xl overflow-hidden shrink-0 hidden sm:block">
                      <img src={d.img} alt="" width={400} height={300} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="text-azure font-bold text-xs uppercase tracking-widest mb-2">Day {d.day} · {d.tag}</div>
                      <h3 className="text-xl font-display font-semibold mb-2">{d.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{d.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {d.chips.map((c) => (
                          <span key={c} className="text-xs py-1.5 px-3 rounded-full glass">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full glass-strong rounded-2xl py-3.5 text-sm font-semibold hover:bg-surface-strong transition-all flex items-center justify-center gap-2">
                Export to wallet <ArrowRight className="size-4" />
              </button>
            </div>
          ) : (
            <div className="glass rounded-3xl p-12 text-center min-h-[400px] grid place-items-center">
              <div>
                <Sparkles className="size-10 text-azure mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold">Ready when you are</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                  Adjust your preferences on the left, then hit Generate. Your itinerary will materialize here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}

function Field({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
        <Icon className="size-3.5" /> {label}
      </div>
      {children}
    </label>
  );
}

function sampleItinerary(days: number) {
  const base = [
    { day: "01", tag: "Arrival", title: "Neon nights in Shibuya", desc: "Land in Tokyo, settle into your ryokan, and ease into Japan with hidden izakayas in Ebisu.", chips: ["18:00 · Dinner", "21:00 · Sky deck"], img: destTokyo },
    { day: "02", tag: "Tradition", title: "Imperial gardens & tea ceremony", desc: "Morning at Shinjuku Gyoen followed by a private tea session with a certified master.", chips: ["09:00 · Garden", "14:00 · Tea master"], img: destKyoto },
    { day: "03", tag: "Transit", title: "Shinkansen to Kyoto", desc: "Bullet train south, then an afternoon walking the Philosopher's Path in soft autumn light.", chips: ["10:00 · Shinkansen", "16:00 · Walk"], img: destKyoto },
    { day: "04", tag: "Culture", title: "Fushimi Inari at dawn", desc: "Beat the crowds. 10,000 vermilion gates with morning mist. Brunch in Higashiyama.", chips: ["06:00 · Sunrise", "11:00 · Brunch"], img: destTokyo },
    { day: "05", tag: "Local", title: "Nishiki Market deep-dive", desc: "Guided food crawl through Kyoto's kitchen, including five tastings and a sake pairing.", chips: ["12:00 · Crawl", "19:00 · Sake"], img: destKyoto },
  ];
  return base.slice(0, Math.min(days, base.length));
}
