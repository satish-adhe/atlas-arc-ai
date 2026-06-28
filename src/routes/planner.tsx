import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, MapPin, Calendar, Wallet, Heart, ArrowRight, Loader2, Users, Plane, CloudSun, Hotel, Utensils, Camera, Compass } from "lucide-react";
import { generateItinerary, type Itinerary, type ItineraryDay } from "@/lib/planner.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Trip Planner — TripGenius AI" },
      { name: "description", content: "Plan a trip to anywhere in the world. AI builds a personalized day-by-day itinerary, budget, hotels, and routes in seconds." },
      { property: "og:title", content: "AI Trip Planner — TripGenius AI" },
      { property: "og:description", content: "Worldwide AI itineraries — any city, country, island, or multi-stop tour." },
    ],
  }),
  component: Planner,
});

const interests = ["Food", "Nature", "History", "Nightlife", "Architecture", "Adventure", "Wellness", "Art", "Beaches", "Shopping"];
const groups = ["Solo", "Couple", "Family", "Friends"];
const transports = ["Mixed", "Flights", "Train", "Road trip", "Public transit"];

async function fetchWikiImage(title: string): Promise<string | null> {
  try {
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    if (!r.ok) return null;
    const j = (await r.json()) as { originalimage?: { source?: string }; thumbnail?: { source?: string } };
    return j.originalimage?.source ?? j.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

function Planner() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(2500);
  const [selected, setSelected] = useState<string[]>(["Food", "Nature"]);
  const [group, setGroup] = useState("Solo");
  const [transport, setTransport] = useState("Mixed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [heroImg, setHeroImg] = useState<string | null>(null);
  const [dayImgs, setDayImgs] = useState<Record<number, string>>({});
  const callPlan = useServerFn(generateItinerary);

  const toggle = (i: string) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  async function generate() {
    if (!destination.trim() || loading) return;
    setLoading(true);
    setError(null);
    setItinerary(null);
    setHeroImg(null);
    setDayImgs({});
    try {
      const result = await callPlan({
        data: { destination: destination.trim(), days, budgetUSD: budget, interests: selected, groupType: group, transport },
      });
      setItinerary(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  // Fetch hero + per-day images in parallel after itinerary loads
  useEffect(() => {
    if (!itinerary) return;
    let cancelled = false;
    (async () => {
      const hero =
        (await fetchWikiImage(itinerary.cities[0] || itinerary.destination)) ??
        (await fetchWikiImage(itinerary.destination));
      if (!cancelled && hero) setHeroImg(hero);
    })();
    itinerary.days.forEach((d) => {
      (async () => {
        const img =
          (await fetchWikiImage(d.imageQuery || `${d.city}`)) ??
          (await fetchWikiImage(d.city));
        if (!cancelled && img) setDayImgs((prev) => ({ ...prev, [d.day]: img }));
      })();
    });
    return () => { cancelled = true; };
  }, [itinerary]);

  return (
    <SiteShell>
      <PageHeader
        eyebrow="AI Planner · Worldwide"
        title="Anywhere on Earth, planned in seconds."
        subtitle="Type any city, country, island, region, or multi-stop tour. The AI builds your full itinerary, budget, hotels, food, and routes."
      />

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-12 gap-8">
        {/* Form */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="glass rounded-3xl p-6 space-y-6">
            <Field icon={MapPin} label="Destination">
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Paris, Bali, Switzerland, Ladakh, Europe Tour"
                className="w-full bg-transparent outline-none text-lg font-medium placeholder:text-muted-foreground/60"
              />
            </Field>
            <Field icon={Calendar} label="Duration">
              <div className="flex items-center gap-4">
                <input type="range" min={1} max={30} value={days} onChange={(e) => setDays(+e.target.value)} className="flex-1 accent-azure" />
                <span className="text-lg font-semibold w-20 text-right">{days} days</span>
              </div>
            </Field>
            <Field icon={Wallet} label="Budget (USD)">
              <div className="flex items-center gap-4">
                <input type="range" min={300} max={20000} step={100} value={budget} onChange={(e) => setBudget(+e.target.value)} className="flex-1 accent-azure" />
                <span className="text-lg font-semibold w-24 text-right">${budget.toLocaleString()}</span>
              </div>
            </Field>
            <Field icon={Users} label="Group">
              <div className="flex flex-wrap gap-2">
                {groups.map((g) => (
                  <button key={g} onClick={() => setGroup(g)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${group === g ? "bg-azure text-white border-azure" : "border-hairline text-muted-foreground hover:text-foreground hover:border-foreground/40"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </Field>
            <Field icon={Plane} label="Transport">
              <div className="flex flex-wrap gap-2">
                {transports.map((t) => (
                  <button key={t} onClick={() => setTransport(t)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${transport === t ? "bg-azure text-white border-azure" : "border-hairline text-muted-foreground hover:text-foreground hover:border-foreground/40"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field icon={Heart} label="Interests">
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <button key={i} onClick={() => toggle(i)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      selected.includes(i) ? "bg-azure text-white border-azure" : "bg-transparent border-hairline text-muted-foreground hover:text-foreground hover:border-foreground/40"
                    }`}>
                    {i}
                  </button>
                ))}
              </div>
            </Field>

            <button
              onClick={generate}
              disabled={loading || !destination.trim()}
              className="w-full bg-azure hover:bg-azure-glow text-white py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <><Loader2 className="size-4 animate-spin" /> Composing itinerary…</> : <><Sparkles className="size-4" /> Generate Itinerary</>}
            </button>
            {error && <div className="text-xs text-red-400">{error}</div>}
          </div>

          <div className="glass rounded-3xl p-6 text-sm text-muted-foreground">
            <div className="text-xs font-bold uppercase tracking-widest text-azure mb-3">Tip</div>
            Try anything: <span className="text-foreground">"Iceland ring road"</span>, <span className="text-foreground">"South India temple trail"</span>, <span className="text-foreground">"Tokyo + Seoul + Taipei"</span>, or just <span className="text-foreground">"World tour"</span>.
          </div>
        </div>

        {/* Result */}
        <div className="col-span-12 lg:col-span-7">
          {loading ? (
            <div className="space-y-4">
              <div className="glass rounded-3xl h-48 animate-pulse" />
              {[0, 1, 2].map((i) => (
                <div key={i} className="glass rounded-3xl p-6 h-40 animate-pulse" />
              ))}
            </div>
          ) : itinerary ? (
            <ItineraryView itinerary={itinerary} heroImg={heroImg} dayImgs={dayImgs} />
          ) : (
            <div className="glass rounded-3xl p-12 text-center min-h-[400px] grid place-items-center">
              <div>
                <Sparkles className="size-10 text-azure mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold">Ready when you are</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                  Enter any destination on the left and hit Generate. Your custom itinerary will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}

function ItineraryView({ itinerary, heroImg, dayImgs }: { itinerary: Itinerary; heroImg: string | null; dayImgs: Record<number, string> }) {
  const bb = itinerary.budgetBreakdown;
  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl overflow-hidden">
        <div className="relative h-56 sm:h-72 bg-surface-strong">
          {heroImg ? (
            <img src={heroImg} alt={itinerary.destination} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-muted-foreground"><Loader2 className="size-6 animate-spin" /></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Your AI Trip</div>
            <h2 className="text-3xl font-display font-bold mt-1">{itinerary.destination}</h2>
            <p className="text-sm opacity-90 mt-1 line-clamp-2 max-w-2xl">{itinerary.summary}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-hairline border-t border-hairline">
          <Stat icon={Calendar} label="Days" value={String(itinerary.days.length)} />
          <Stat icon={Wallet} label="Est. budget" value={`$${itinerary.estimatedBudgetUSD.toLocaleString()}`} />
          <Stat icon={CloudSun} label="Best time" value={itinerary.bestTime} />
          <Stat icon={MapPin} label="Cities" value={String(itinerary.cities.length)} />
        </div>
      </div>

      <Section icon={Compass} title="Route">
        <div className="flex flex-wrap items-center gap-2">
          {itinerary.cities.map((c, idx) => (
            <div key={c + idx} className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full glass text-sm font-medium">{c}</span>
              {idx < itinerary.cities.length - 1 && <ArrowRight className="size-3 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Wallet} title="Budget breakdown">
        <div className="space-y-2">
          {[
            ["Stay", bb.stay], ["Food", bb.food], ["Transport", bb.transport], ["Activities", bb.activities], ["Misc", bb.misc],
          ].map(([label, val]) => {
            const total = bb.stay + bb.food + bb.transport + bb.activities + bb.misc || 1;
            const pct = Math.round((Number(val) / total) * 100);
            return (
              <div key={label as string}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold">${Number(val).toLocaleString()} · {pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-strong overflow-hidden">
                  <div className="h-full bg-azure" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Day by day</h3>
        {itinerary.days.map((d) => <DayCard key={d.day} d={d} img={dayImgs[d.day]} />)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section icon={Hotel} title="Where to stay">
          <ul className="space-y-2 text-sm">
            {itinerary.hotels.map((h) => (
              <li key={h.name} className="flex justify-between gap-3">
                <div><div className="font-medium">{h.name}</div><div className="text-xs text-muted-foreground">{h.city} · {h.vibe}</div></div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">${h.pricePerNightUSD}/nt</div>
              </li>
            ))}
          </ul>
        </Section>
        <Section icon={Utensils} title="Eat here">
          <ul className="space-y-2 text-sm">
            {itinerary.restaurants.map((r) => (
              <li key={r.name}><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.city} · {r.cuisine}</div></li>
            ))}
          </ul>
        </Section>
        <Section icon={Camera} title="Must-see">
          <ul className="space-y-2 text-sm">
            {itinerary.attractions.map((a) => (
              <li key={a.name}><div className="font-medium">{a.name}</div><div className="text-xs text-muted-foreground">{a.city} · {a.type}</div></li>
            ))}
          </ul>
        </Section>
        <Section icon={Sparkles} title="Hidden gems">
          <ul className="space-y-2 text-sm">
            {itinerary.hiddenGems.map((g) => (
              <li key={g.name}><div className="font-medium">{g.name}</div><div className="text-xs text-muted-foreground">{g.city} · {g.why}</div></li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="glass rounded-2xl p-4 text-sm flex items-start gap-3">
        <CloudSun className="size-5 text-azure shrink-0 mt-0.5" />
        <div><span className="font-semibold">Weather:</span> <span className="text-muted-foreground">{itinerary.weather}</span></div>
      </div>
    </div>
  );
}

function DayCard({ d, img }: { d: ItineraryDay; img?: string }) {
  return (
    <div className="glass rounded-3xl p-5 hover:bg-surface-strong transition-all">
      <div className="flex gap-4">
        <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 hidden sm:block bg-surface-strong">
          {img ? (
            <img src={img} alt={d.title} loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-muted-foreground"><Loader2 className="size-4 animate-spin" /></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-azure font-bold text-xs uppercase tracking-widest">Day {d.day} · {d.tag}</span>
            <span className="text-xs text-muted-foreground">· {d.city}</span>
          </div>
          <h3 className="text-lg font-display font-semibold mb-1.5">{d.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{d.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <Slot label="Morning" value={d.morning} />
            <Slot label="Afternoon" value={d.afternoon} />
            <Slot label="Evening" value={d.evening} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Slot({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl glass p-2.5">
      <div className="text-[10px] uppercase tracking-widest text-azure font-bold mb-0.5">{label}</div>
      <div className="text-foreground/90">{value}</div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1"><Icon className="size-3" /> {label}</div>
      <div className="text-sm font-semibold truncate">{value}</div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3"><Icon className="size-3.5" /> {title}</div>
      {children}
    </div>
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
