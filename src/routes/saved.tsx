import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { Download, Share2, Trash2 } from "lucide-react";
import destTokyo from "@/assets/dest-tokyo.jpg";
import destSantorini from "@/assets/dest-santorini.jpg";
import destNorway from "@/assets/dest-norway.jpg";
import destBali from "@/assets/dest-bali.jpg";
import destMarrakech from "@/assets/dest-marrakech.jpg";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Trips — TripGenius AI" },
      { name: "description", content: "All your saved itineraries, ready to share, export, or relaunch." },
      { property: "og:title", content: "Saved Trips — TripGenius AI" },
      { property: "og:description", content: "All your saved itineraries, ready to share, export, or relaunch." },
    ],
  }),
  component: Saved,
});

const trips = [
  { name: "Tokyo & Kyoto", img: destTokyo, days: 7, budget: 2840, saved: "2 days ago" },
  { name: "Santorini Escape", img: destSantorini, days: 6, budget: 2210, saved: "1 week ago" },
  { name: "Norwegian Fjords", img: destNorway, days: 8, budget: 3640, saved: "3 weeks ago" },
  { name: "Bali Wellness", img: destBali, days: 10, budget: 1580, saved: "1 month ago" },
  { name: "Marrakech Trails", img: destMarrakech, days: 7, budget: 1740, saved: "2 months ago" },
];

function Saved() {
  return (
    <SiteShell>
      <PageHeader eyebrow="Saved" title="Your library of journeys." subtitle="Every itinerary you've crafted — export to wallet, share with friends, or revive any plan." />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-4">
        {trips.map((t) => (
          <div key={t.name} className="glass rounded-3xl p-4 md:p-5 flex flex-col md:flex-row gap-5 items-stretch md:items-center hover:bg-surface-strong transition-all">
            <div className="w-full md:w-44 h-32 rounded-2xl overflow-hidden shrink-0">
              <img src={t.img} alt={t.name} width={400} height={300} loading="lazy" className="size-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-display font-semibold">{t.name}</h3>
              <div className="text-xs text-muted-foreground mt-1">{t.days} days · ${t.budget.toLocaleString()} estimated</div>
              <div className="text-[10px] uppercase tracking-widest text-azure mt-2">Saved {t.saved}</div>
            </div>
            <div className="flex gap-2 md:gap-3 shrink-0">
              <ActionBtn icon={Share2} label="Share" />
              <ActionBtn icon={Download} label="Export" />
              <ActionBtn icon={Trash2} label="Delete" danger />
              <Link to="/planner" className="hidden md:inline-flex items-center px-5 py-2.5 bg-azure hover:bg-azure-glow text-white rounded-full text-sm font-semibold transition-all">Re-open</Link>
            </div>
          </div>
        ))}
      </div>
    </SiteShell>
  );
}

function ActionBtn({ icon: Icon, label, danger }: { icon: React.ElementType; label: string; danger?: boolean }) {
  return (
    <button
      title={label}
      className={`size-10 grid place-items-center rounded-full glass hover:bg-surface-strong transition-colors ${danger ? "hover:text-destructive" : ""}`}
    >
      <Icon className="size-4" />
    </button>
  );
}
