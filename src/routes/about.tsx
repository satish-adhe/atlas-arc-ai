import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { useState } from "react";
import { Mail, MapPin, Phone, Sparkles, Globe, Heart, Send } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Contact — TripGenius AI" },
      { name: "description", content: "Built by travelers, engineers, and AI researchers to make the world more reachable." },
      { property: "og:title", content: "About & Contact — TripGenius AI" },
      { property: "og:description", content: "Built by travelers, engineers, and AI researchers to make the world more reachable." },
    ],
  }),
  component: About,
});

function About() {
  const [sent, setSent] = useState(false);
  return (
    <SiteShell>
      <PageHeader eyebrow="About" title="Built for those who go." subtitle="We're a small team of travelers, engineers, and AI researchers obsessed with making the world easier to reach." />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Sparkles, t: "AI-first", d: "Every interaction is powered by models that learn the rhythm of how you travel, not just where." },
          { icon: Globe, t: "Globally minded", d: "184 countries indexed, 11 languages supported, infinitely curious." },
          { icon: Heart, t: "Traveler-led", d: "Built by people who'd rather miss a flight than miss the moment." },
        ].map((b) => (
          <div key={b.t} className="glass rounded-3xl p-7">
            <div className="size-11 rounded-xl bg-azure/10 border border-azure/20 grid place-items-center mb-5">
              <b.icon className="size-5 text-azure" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-2">{b.t}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{b.d}</p>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-3xl p-8">
          <h2 className="text-3xl font-display font-bold mb-2">Get in touch</h2>
          <p className="text-sm text-muted-foreground mb-8">Press, partnerships, or just to say hi. We read everything.</p>
          {sent ? (
            <div className="rounded-2xl bg-azure/10 border border-azure/20 p-6 text-center">
              <Sparkles className="size-6 text-azure mx-auto mb-3" />
              <p className="font-semibold">Message in flight.</p>
              <p className="text-sm text-muted-foreground">We'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <input required placeholder="Your name" className="w-full glass rounded-xl px-4 py-3.5 outline-none focus:border-azure transition-colors" />
              <input required type="email" placeholder="Email" className="w-full glass rounded-xl px-4 py-3.5 outline-none focus:border-azure transition-colors" />
              <textarea required rows={5} placeholder="Tell us what's on your mind…" className="w-full glass rounded-xl px-4 py-3.5 outline-none focus:border-azure transition-colors resize-none" />
              <button className="bg-azure hover:bg-azure-glow text-white px-6 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-2">
                Send message <Send className="size-4" />
              </button>
            </form>
          )}
        </div>
        <div className="space-y-4">
          {[
            { icon: Mail, t: "hello@tripgenius.ai", s: "Email us anytime" },
            { icon: Phone, t: "+1 (415) 555 0142", s: "Mon–Fri · 9–6 PT" },
            { icon: MapPin, t: "San Francisco · Lisbon · Tokyo", s: "Three offices, one mission" },
          ].map((c) => (
            <div key={c.t} className="glass rounded-2xl p-6 flex items-start gap-4">
              <div className="size-11 rounded-xl bg-azure/10 border border-azure/20 grid place-items-center shrink-0">
                <c.icon className="size-5 text-azure" />
              </div>
              <div>
                <div className="font-semibold">{c.t}</div>
                <div className="text-sm text-muted-foreground">{c.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
