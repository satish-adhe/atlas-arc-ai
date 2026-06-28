import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { Star, MapPin, Coffee, Utensils, Music, Mountain } from "lucide-react";
import destSantorini from "@/assets/dest-santorini.jpg";
import destBali from "@/assets/dest-bali.jpg";
import destKyoto from "@/assets/dest-kyoto.jpg";
import destMarrakech from "@/assets/dest-marrakech.jpg";

export const Route = createFileRoute("/hotels")({
  head: () => ({
    meta: [
      { title: "Hotels & Activities — TripGenius AI" },
      { name: "description", content: "Curated stays and AI-recommended activities for every traveler." },
      { property: "og:title", content: "Hotels & Activities — TripGenius AI" },
      { property: "og:description", content: "Curated stays and AI-recommended activities for every traveler." },
    ],
  }),
  component: Hotels,
});

const stays = [
  { name: "Tabi Ryokan Kyoto", city: "Kyoto, Japan", img: destKyoto, price: 280, rating: 4.9 },
  { name: "Caldera Suites", city: "Santorini, Greece", img: destSantorini, price: 410, rating: 4.8 },
  { name: "Ubud Forest Villa", city: "Bali, Indonesia", img: destBali, price: 195, rating: 4.9 },
  { name: "Riad Yasmine", city: "Marrakech, Morocco", img: destMarrakech, price: 160, rating: 4.7 },
];

const activities = [
  { name: "Sunrise tea ceremony", icon: Coffee, city: "Kyoto", time: "06:00" },
  { name: "Izakaya food crawl", icon: Utensils, city: "Tokyo", time: "19:00" },
  { name: "Underground jazz club", icon: Music, city: "Marrakech", time: "21:30" },
  { name: "Volcano sunrise hike", icon: Mountain, city: "Bali", time: "04:30" },
];

function Hotels() {
  return (
    <SiteShell>
      <PageHeader eyebrow="Stays & Activities" title="Sleep well. Live deeper." subtitle="AI-curated places to rest and remarkable things to do — picked for your trip's tone." />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">Recommended stays</h2>
          <span className="text-xs text-muted-foreground">4 of 286</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stays.map((s) => (
            <div key={s.name} className="glass rounded-3xl overflow-hidden group hover:bg-surface-strong transition-all">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={s.img} alt={s.name} width={800} height={600} loading="lazy" className="size-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass-strong text-xs font-semibold flex items-center gap-1">
                  <Star className="size-3 fill-azure text-azure" /> {s.rating}
                </div>
              </div>
              <div className="p-5">
                <div className="text-[10px] text-azure font-bold uppercase tracking-widest flex items-center gap-1"><MapPin className="size-3" /> {s.city}</div>
                <h3 className="font-display font-semibold mt-1.5">{s.name}</h3>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-lg font-display font-bold">${s.price}</span>
                  <span className="text-xs text-muted-foreground">per night</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-display font-bold mt-16 mb-6">AI-picked activities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {activities.map((a) => (
            <div key={a.name} className="glass rounded-3xl p-6 hover:bg-surface-strong transition-all">
              <div className="size-11 rounded-xl bg-azure/10 border border-azure/20 grid place-items-center mb-5">
                <a.icon className="size-5 text-azure" />
              </div>
              <h3 className="font-display font-semibold">{a.name}</h3>
              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-3">
                <span className="flex items-center gap-1"><MapPin className="size-3" /> {a.city}</span>
                <span>· {a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
