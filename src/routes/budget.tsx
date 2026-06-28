import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { useState } from "react";
import { Plane, Hotel, Utensils, Ticket, Bus, Wallet } from "lucide-react";

export const Route = createFileRoute("/budget")({
  head: () => ({
    meta: [
      { title: "Budget Planner — TripGenius AI" },
      { name: "description", content: "Smart, currency-aware budget breakdown for every leg of your journey." },
      { property: "og:title", content: "Budget Planner — TripGenius AI" },
      { property: "og:description", content: "Smart, currency-aware budget breakdown for every leg of your journey." },
    ],
  }),
  component: Budget,
});

const cats = [
  { key: "Flights", icon: Plane, pct: 32, amt: 912, color: "from-azure to-azure-glow" },
  { key: "Stays", icon: Hotel, pct: 28, amt: 798, color: "from-sky-500 to-cyan-400" },
  { key: "Food", icon: Utensils, pct: 18, amt: 513, color: "from-violet-500 to-fuchsia-400" },
  { key: "Activities", icon: Ticket, pct: 14, amt: 399, color: "from-emerald-500 to-teal-400" },
  { key: "Transit", icon: Bus, pct: 8, amt: 228, color: "from-amber-500 to-orange-400" },
];

function Budget() {
  const [total, setTotal] = useState(2850);
  return (
    <SiteShell>
      <PageHeader eyebrow="Budget" title="Spend with precision." subtitle="Adjust your total budget, and watch every category recalibrate in real time." />

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5">
          <div className="glass rounded-3xl p-7">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-azure mb-3">
              <Wallet className="size-3.5" /> Total Budget
            </div>
            <div className="text-5xl font-display font-bold">${total.toLocaleString()}</div>
            <input type="range" min={500} max={15000} step={50} value={total} onChange={(e) => setTotal(+e.target.value)} className="w-full mt-6 accent-azure" />
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
              <span>$500</span>
              <span>$15,000</span>
            </div>

            <div className="mt-8 pt-6 border-t border-hairline grid grid-cols-2 gap-4">
              <Stat label="Per day" value={`$${Math.round(total / 7)}`} />
              <Stat label="Per person" value={`$${Math.round(total / 2)}`} />
              <Stat label="Buffer" value="12%" />
              <Stat label="Currency" value="USD" />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 space-y-4">
          <div className="glass rounded-3xl p-6">
            <h3 className="font-display font-semibold mb-5">Breakdown</h3>
            <div className="space-y-4">
              {cats.map((c) => {
                const amt = Math.round((total * c.pct) / 100);
                return (
                  <div key={c.key}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <c.icon className="size-4 text-azure" />
                        <span className="font-medium">{c.key}</span>
                        <span className="text-xs text-muted-foreground">· {c.pct}%</span>
                      </div>
                      <span className="font-display font-semibold">${amt.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${c.color}`} style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cats.slice(0, 3).map((c) => (
              <div key={c.key} className="glass rounded-2xl p-5">
                <c.icon className="size-5 text-azure mb-3" />
                <div className="text-xs text-muted-foreground uppercase tracking-widest">{c.key}</div>
                <div className="text-2xl font-display font-bold mt-1">${Math.round((total * c.pct) / 100)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-lg font-display font-semibold mt-1">{value}</div>
    </div>
  );
}
