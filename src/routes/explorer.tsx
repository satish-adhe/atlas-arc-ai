import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { useState } from "react";
import { Search, MapPin, ArrowRight } from "lucide-react";
import destTokyo from "@/assets/dest-tokyo.jpg";
import destKyoto from "@/assets/dest-kyoto.jpg";
import destNorway from "@/assets/dest-norway.jpg";
import destSantorini from "@/assets/dest-santorini.jpg";
import destBali from "@/assets/dest-bali.jpg";
import destMarrakech from "@/assets/dest-marrakech.jpg";

export const Route = createFileRoute("/explorer")({
  head: () => ({
    meta: [
      { title: "Destination Explorer — TripGenius AI" },
      { name: "description", content: "Browse curated, AI-ranked destinations from urban escapes to remote fjords." },
      { property: "og:title", content: "Destination Explorer — TripGenius AI" },
      { property: "og:description", content: "Curated, AI-ranked destinations from urban escapes to remote fjords." },
    ],
  }),
  component: Explorer,
});

const all = [
  { name: "Tokyo", country: "Japan", img: destTokyo, tag: "Urban", days: 7, price: 2840, rating: 4.9 },
  { name: "Kyoto", country: "Japan", img: destKyoto, tag: "Cultural", days: 5, price: 1920, rating: 4.8 },
  { name: "Geirangerfjord", country: "Norway", img: destNorway, tag: "Nature", days: 8, price: 3640, rating: 4.9 },
  { name: "Santorini", country: "Greece", img: destSantorini, tag: "Coastal", days: 6, price: 2210, rating: 4.7 },
  { name: "Ubud", country: "Bali", img: destBali, tag: "Wellness", days: 10, price: 1580, rating: 4.8 },
  { name: "Marrakech", country: "Morocco", img: destMarrakech, tag: "Cultural", days: 7, price: 1740, rating: 4.6 },
];
const tags = ["All", "Urban", "Nature", "Coastal", "Cultural", "Wellness"];

function Explorer() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("All");
  const filtered = all.filter(
    (d) => (tag === "All" || d.tag === tag) && (d.name.toLowerCase().includes(q.toLowerCase()) || d.country.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Explorer"
        title="Every place worth going."
        subtitle="AI-ranked destinations updated daily. Filter by mood, season, or vibe — then send any pick straight to the planner."
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2 mb-6">
          <div className="flex-1 flex items-center gap-3 px-4">
            <Search className="size-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search destinations or countries" className="w-full bg-transparent outline-none py-3" />
          </div>
        </div>
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
          {filtered.map((d) => (
            <Link
              to="/planner"
              key={d.name}
              className="group glass rounded-3xl overflow-hidden hover:bg-surface-strong transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={d.img} alt={d.name} width={1024} height={768} loading="lazy" className="size-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-strong text-[10px] font-bold uppercase tracking-widest">{d.tag}</div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass-strong text-xs font-semibold">★ {d.rating}</div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-azure font-bold uppercase tracking-widest flex items-center gap-1"><MapPin className="size-3" /> {d.country}</div>
                  <h3 className="text-xl font-display font-semibold mt-1">{d.name}</h3>
                  <div className="text-xs text-muted-foreground mt-1">{d.days} days · from ${d.price.toLocaleString()}</div>
                </div>
                <div className="size-10 rounded-full glass grid place-items-center group-hover:bg-azure group-hover:border-azure transition-colors">
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
