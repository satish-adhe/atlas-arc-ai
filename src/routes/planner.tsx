import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, MapPin, Calendar, Wallet, Heart, ArrowRight, Loader2, Users, Plane, CloudSun, Hotel, Utensils, Camera, Compass, Navigation, Download, Route as RouteIcon } from "lucide-react";
import { generateItinerary, type Itinerary, type ItineraryDay } from "@/lib/planner.functions";
import { CURRENCIES, formatMoney, type CurrencyCode } from "@/lib/currency";
import { downloadItineraryPDF } from "@/lib/itinerary-pdf";
import destTokyo from "@/assets/dest-tokyo.jpg";
import destKyoto from "@/assets/dest-kyoto.jpg";
import destNorway from "@/assets/dest-norway.jpg";
import destSantorini from "@/assets/dest-santorini.jpg";
import destBali from "@/assets/dest-bali.jpg";
import destMarrakech from "@/assets/dest-marrakech.jpg";
import heroDubaiSkyline from "@/assets/hero-dubai-skyline.jpg";
import heroNatureWalk from "@/assets/hero-nature-walk.jpg";

const rotatingPlaces = [
  { img: destTokyo, name: "Tokyo", country: "Japan" },
  { img: destKyoto, name: "Kyoto", country: "Japan" },
  { img: destSantorini, name: "Santorini", country: "Greece" },
  { img: destBali, name: "Ubud", country: "Bali" },
  { img: destNorway, name: "Geirangerfjord", country: "Norway" },
  { img: heroDubaiSkyline, name: "Dubai", country: "UAE" },
  { img: destMarrakech, name: "Marrakech", country: "Morocco" },
  { img: heroNatureWalk, name: "Wild Trails", country: "Nature" },
];

function ReadyPlaceholder() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % rotatingPlaces.length), 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="glass rounded-3xl overflow-hidden min-h-[400px] relative">
      <div className="relative h-72 sm:h-80 w-full overflow-hidden">
        {rotatingPlaces.map((p, idx) => (
          <img
            key={p.name}
            src={p.img}
            alt={p.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === i ? "opacity-100 scale-105" : "opacity-0"}`}
            style={{ transition: "opacity 1s ease-in-out, transform 6s ease-in-out" }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-5 text-white drop-shadow">
          <div className="text-[10px] uppercase tracking-widest opacity-80 font-bold">{rotatingPlaces[i].country}</div>
          <div className="text-2xl font-display font-bold">{rotatingPlaces[i].name}</div>
        </div>
        <div className="absolute top-4 right-4 flex gap-1.5">
          {rotatingPlaces.map((_, idx) => (
            <span key={idx} className={`h-1 rounded-full transition-all ${idx === i ? "w-6 bg-azure" : "w-1.5 bg-white/40"}`} />
          ))}
        </div>
      </div>
      <div className="p-6 text-center">
        <Sparkles className="size-7 text-azure mx-auto mb-3" />
        <h3 className="text-xl font-display font-semibold">Ready when you are</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          Enter any destination on the left and hit Generate — or search from the home page and we'll plan it instantly.
        </p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/planner")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" ? s.q : undefined,
    days: s.days != null ? Number(s.days) || undefined : undefined,
    budget: s.budget != null ? Number(s.budget) || undefined : undefined,
    interests: typeof s.interests === "string" ? s.interests : undefined,
    auto: s.auto === 1 || s.auto === "1" ? 1 : undefined,
  }),
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

async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
    if (!r.ok) return null;
    const j = (await r.json()) as { address?: Record<string, string>; display_name?: string };
    const a = j.address ?? {};
    const city = a.city || a.town || a.village || a.county || a.state;
    const country = a.country;
    if (city && country) return `${city}, ${country}`;
    return j.display_name ?? null;
  } catch {
    return null;
  }
}

function Planner() {
  const search = Route.useSearch();
  const [destination, setDestination] = useState(search.q ?? "");
  const [origin, setOrigin] = useState("");
  const [tripMode, setTripMode] = useState<"direct" | "scenic">("direct");
  const [locLoading, setLocLoading] = useState(false);
  const [days, setDays] = useState(search.days ?? 5);
  const [budget, setBudget] = useState(search.budget ?? 2500);
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    if (typeof window === "undefined") return "USD";
    return (localStorage.getItem("tg_currency") as CurrencyCode) || "USD";
  });
  const [selected, setSelected] = useState<string[]>(
    search.interests ? search.interests.split(",").filter(Boolean) : ["Food", "Nature"]
  );
  const [group, setGroup] = useState("Solo");
  const [transport, setTransport] = useState("Mixed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [heroImg, setHeroImg] = useState<string | null>(null);
  const [dayImgs, setDayImgs] = useState<Record<number, string>>({});
  const callPlan = useServerFn(generateItinerary);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("tg_currency", currency);
  }, [currency]);

  const toggle = (i: string) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation isn't available in this browser.");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const label = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setOrigin(label ?? `${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`);
        setLocLoading(false);
      },
      () => {
        setError("Couldn't read your location — enter it manually.");
        setLocLoading(false);
      },
      { timeout: 8000 }
    );
  };

  async function generate(overrides?: { destination?: string; days?: number; budget?: number; interests?: string[] }) {
    const dest = (overrides?.destination ?? destination).trim();
    if (!dest || loading) return;
    setLoading(true);
    setError(null);
    setItinerary(null);
    setHeroImg(null);
    setDayImgs({});
    try {
      const result = await callPlan({
        data: {
          destination: dest,
          days: overrides?.days ?? days,
          budgetUSD: overrides?.budget ?? budget,
          interests: overrides?.interests ?? selected,
          groupType: group,
          transport,
          origin: origin.trim() || undefined,
          tripMode,
        },
      });
      setItinerary(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (search.auto && search.q) {
      generate({
        destination: search.q,
        days: search.days,
        budget: search.budget,
        interests: search.interests ? search.interests.split(",").filter(Boolean) : undefined,
      });
    }
  }, []);

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

      <div className="max-w-7xl mx-auto px-6 py-6 md:py-8 grid grid-cols-12 gap-6">
        {/* Form */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="glass rounded-3xl p-6 space-y-6">
            <Field icon={Navigation} label="Starting from (optional)">
              <div className="flex items-center gap-2">
                <input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Delhi, India — or use my location"
                  className="flex-1 bg-transparent outline-none text-base font-medium placeholder:text-muted-foreground/60"
                />
                <button
                  type="button"
                  onClick={useMyLocation}
                  disabled={locLoading}
                  title="Use my location"
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border border-hairline hover:border-azure hover:text-azure transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {locLoading ? <Loader2 className="size-3.5 animate-spin" /> : <MapPin className="size-3.5" />}
                  {locLoading ? "Locating…" : "Use my location"}
                </button>
              </div>
              {origin && (
                <div className="mt-3 flex gap-2">
                  <ModeChip active={tripMode === "direct"} onClick={() => setTripMode("direct")} icon={Plane} label="Direct" hint="Straight to destination" />
                  <ModeChip active={tripMode === "scenic"} onClick={() => setTripMode("scenic")} icon={RouteIcon} label="Scenic" hint="Cover places on the way" />
                </div>
              )}
            </Field>

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
            <Field icon={Wallet} label={`Budget (${currency})`}>
              <div className="flex items-center gap-3 mb-3">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  style={{ backgroundColor: "#0f172a", color: "#f8fafc" }}
                  className="border border-hairline rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus:border-azure cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} style={{ backgroundColor: "#0f172a", color: "#f8fafc" }}>
                      {c.code} · {c.symbol} · {c.name}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-muted-foreground">Displayed everywhere in {currency}</span>
              </div>
              <div className="flex items-center gap-4">
                <input type="range" min={300} max={20000} step={100} value={budget} onChange={(e) => setBudget(+e.target.value)} className="flex-1 accent-azure" />
                <span className="text-lg font-semibold w-28 text-right">{formatMoney(budget, currency)}</span>
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
              onClick={() => generate()}
              disabled={loading || !destination.trim()}
              className="w-full bg-azure hover:bg-azure-glow text-white py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <><Loader2 className="size-4 animate-spin" /> Building your trip…</> : <><Sparkles className="size-4" /> Generate Itinerary</>}
            </button>
            {error && <div className="text-xs text-red-400">{error}</div>}
          </div>

          <div className="glass rounded-3xl p-6 text-sm text-muted-foreground">
            <div className="text-xs font-bold uppercase tracking-widest text-azure mb-3">Tip</div>
            Add your starting city and pick <span className="text-foreground">Scenic</span> to cover cool stops along the way, or <span className="text-foreground">Direct</span> to jump straight in.
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
            <ItineraryView itinerary={itinerary} heroImg={heroImg} dayImgs={dayImgs} currency={currency} />
          ) : (
            <ReadyPlaceholder />
          )}
        </div>
      </div>
    </SiteShell>
  );
}

function ModeChip({ active, onClick, icon: Icon, label, hint }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string; hint: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 px-3 py-2 rounded-xl border text-left transition-all ${active ? "border-azure bg-azure/10" : "border-hairline hover:border-foreground/40"}`}
    >
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <Icon className={`size-3.5 ${active ? "text-azure" : "text-muted-foreground"}`} />
        {label}
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{hint}</div>
    </button>
  );
}

function ItineraryView({ itinerary, heroImg, dayImgs, currency }: { itinerary: Itinerary; heroImg: string | null; dayImgs: Record<number, string>; currency: CurrencyCode }) {
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
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Your AI Trip</div>
              <h2 className="text-3xl font-display font-bold mt-1 truncate">{itinerary.destination}</h2>
              <p className="text-sm opacity-90 mt-1 line-clamp-2 max-w-2xl">{itinerary.summary}</p>
            </div>
            <button
              onClick={() => downloadItineraryPDF(itinerary, currency, heroImg, dayImgs)}
              className="shrink-0 inline-flex items-center gap-1.5 bg-white/95 hover:bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-lg"
            >
              <Download className="size-3.5" /> Download PDF
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-hairline border-t border-hairline">
          <Stat icon={Calendar} label="Days" value={String(itinerary.days.length)} />
          <Stat icon={Wallet} label="Est. budget" value={formatMoney(itinerary.estimatedBudgetUSD, currency)} />
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

      <Section icon={Wallet} title={`Budget breakdown · ${currency}`}>
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
                  <span className="font-semibold">{formatMoney(Number(val), currency)} · {pct}%</span>
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
                <div className="text-xs text-muted-foreground whitespace-nowrap">{formatMoney(h.pricePerNightUSD, currency)}/nt</div>
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

      <button
        onClick={() => downloadItineraryPDF(itinerary, currency, heroImg, dayImgs)}
        className="w-full inline-flex items-center justify-center gap-2 bg-azure hover:bg-azure-glow text-white py-3.5 rounded-2xl font-semibold transition-all"
      >
        <Download className="size-4" /> Download full plan as PDF
      </button>
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
