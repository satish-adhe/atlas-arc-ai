import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { Plane, Calendar, Compass, Wallet, ArrowRight, Plus } from "lucide-react";
import destTokyo from "@/assets/dest-tokyo.jpg";
import destSantorini from "@/assets/dest-santorini.jpg";
import destNorway from "@/assets/dest-norway.jpg";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TripGenius AI" },
      { name: "description", content: "Your trips, upcoming journeys, and AI insights in one place." },
      { property: "og:title", content: "Dashboard — TripGenius AI" },
      { property: "og:description", content: "Your trips, upcoming journeys, and AI insights in one place." },
    ],
  }),
  component: Dashboard,
});

const upcoming = [
  { name: "Tokyo & Kyoto", date: "Mar 14 – 21", img: destTokyo, status: "Confirmed" },
  { name: "Santorini Escape", date: "Jun 02 – 09", img: destSantorini, status: "Planning" },
  { name: "Norwegian Fjords", date: "Aug 18 – 26", img: destNorway, status: "Draft" },
];

function Dashboard() {
  return (
    <SiteShell>
      <PageHeader eyebrow="Dashboard" title="Welcome back, traveler." subtitle="Three trips in motion. The next one departs in 18 days." />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { l: "Trips Planned", v: "14", i: Compass },
            { l: "Next Departure", v: "18d", i: Plane },
            { l: "Saved", v: "$1,240", i: Wallet },
            { l: "Days On Road", v: "42", i: Calendar },
          ].map((s) => (
            <div key={s.l} className="glass rounded-2xl p-5">
              <s.i className="size-5 text-azure mb-3" />
              <div className="text-2xl font-display font-bold">{s.v}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-2xl font-display font-bold">Upcoming trips</h2>
            <Link to="/planner" className="inline-flex items-center gap-1 text-sm font-medium text-azure hover:underline">
              <Plus className="size-4" /> New trip
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {upcoming.map((t) => (
              <Link to="/saved" key={t.name} className="group glass rounded-3xl overflow-hidden hover:bg-surface-strong transition-all">
                <div className="relative aspect-[5/3] overflow-hidden">
                  <img src={t.img} alt={t.name} width={800} height={500} loading="lazy" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-strong text-[10px] font-bold uppercase tracking-widest">{t.status}</div>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold">{t.name}</h3>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.date}</div>
                  </div>
                  <div className="size-9 rounded-full glass grid place-items-center group-hover:bg-azure group-hover:border-azure transition-colors">
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 glass rounded-3xl p-6">
            <h3 className="font-display font-semibold mb-5">Recent AI insights</h3>
            <ul className="divide-y divide-hairline">
              {[
                "Tokyo flight prices dropped 12% — rebooking saves you $186.",
                "Cherry blossom peak shifted to March 28. Consider extending stay.",
                "Your Norwegian ferry has a faster alternate route saving 2 hours.",
              ].map((m) => (
                <li key={m} className="py-3.5 text-sm flex items-start gap-3">
                  <span className="size-1.5 rounded-full bg-azure mt-2 shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-3xl p-6 bg-gradient-to-br from-azure/20 to-transparent border-azure/20">
            <div className="text-xs font-bold uppercase tracking-widest text-azure mb-3">Streak</div>
            <div className="text-5xl font-display font-bold">7</div>
            <p className="text-sm text-muted-foreground mt-2">consecutive months of travel. Keep going.</p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
