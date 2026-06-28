import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import mapWorld from "@/assets/map-world.jpg";
import mapTokyo from "@/assets/map-tokyo.jpg";
import { MapPin, Plane, Train, Footprints } from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Interactive Route Map — TripGenius AI" },
      { name: "description", content: "Visualize your optimized travel route with animated paths and waypoints." },
      { property: "og:title", content: "Interactive Route Map — TripGenius AI" },
      { property: "og:description", content: "Visualize your optimized travel route with animated paths and waypoints." },
    ],
  }),
  component: MapPage,
});

const stops = [
  { name: "Tokyo Haneda", sub: "Arrival · 14:20", icon: Plane },
  { name: "Shinjuku Ryokan", sub: "Check-in · 16:00", icon: MapPin },
  { name: "Shibuya Crossing", sub: "Walk · 18:30", icon: Footprints },
  { name: "Kyoto Station", sub: "Shinkansen · Day 03", icon: Train },
  { name: "Fushimi Inari", sub: "Sunrise · Day 04", icon: MapPin },
  { name: "Kansai Airport", sub: "Departure · Day 07", icon: Plane },
];

function MapPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Route Map"
        title="Every step, optimized."
        subtitle="Watch your itinerary unfold across animated, intelligent paths. Reorder stops with a drag — TripGenius re-routes instantly."
      />

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-5">
          <div className="glass rounded-3xl p-5">
            <h3 className="font-display font-semibold mb-1">Tokyo → Kyoto Loop</h3>
            <p className="text-xs text-muted-foreground mb-5">7 stops · 412 km · 92% efficiency</p>
            <ol className="space-y-3">
              {stops.map((s, i) => (
                <li key={s.name} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="size-9 rounded-full glass-strong grid place-items-center group-hover:bg-azure group-hover:border-azure transition-colors">
                      <s.icon className="size-4" />
                    </div>
                    {i < stops.length - 1 && <div className="flex-1 w-px bg-hairline my-1" />}
                  </div>
                  <div className="pb-3">
                    <div className="text-sm font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.sub}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: "Distance", v: "412 km" },
              { l: "Walk", v: "18.4 km" },
              { l: "CO₂", v: "−42%" },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl p-4 text-center">
                <div className="text-lg font-display font-bold">{s.v}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-5">
          <div className="glass rounded-3xl overflow-hidden relative aspect-[16/10]">
            <img src={mapWorld} alt="World route map" width={1600} height={1000} loading="lazy" className="absolute inset-0 size-full object-cover" />
            <svg className="absolute inset-0 size-full" viewBox="0 0 1600 1000" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gline" x1="0" x2="1">
                  <stop offset="0" stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#7dd3fc" />
                </linearGradient>
              </defs>
              <path d="M 180 700 Q 600 200 1100 500 T 1450 280" fill="none" stroke="url(#gline)" strokeWidth="3" strokeDasharray="8 12" className="animate-draw" strokeLinecap="round" />
              {[[180, 700], [600, 380], [1100, 500], [1450, 280]].map(([x, y], i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="14" fill="#3b82f6" opacity="0.25" />
                  <circle cx={x} cy={y} r="5" fill="#3b82f6" />
                </g>
              ))}
            </svg>
            <div className="absolute bottom-4 left-4 glass-strong rounded-xl px-4 py-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Active Route</div>
              <div className="text-sm font-semibold">LHR → NRT → KIX</div>
            </div>
          </div>

          <div className="glass rounded-3xl overflow-hidden relative aspect-[16/8]">
            <img src={mapTokyo} alt="Tokyo street network" width={1600} height={800} loading="lazy" className="absolute inset-0 size-full object-cover" />
            <div className="absolute bottom-4 left-4 right-4 glass-strong rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">In-city · Tokyo Day 1</div>
                <div className="text-sm font-semibold">5 stops · 8.2 km walking</div>
              </div>
              <button className="bg-azure hover:bg-azure-glow text-white px-4 py-2 rounded-full text-xs font-semibold">Re-optimize</button>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
