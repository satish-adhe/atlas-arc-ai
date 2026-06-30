import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { ArrowRight, Sparkles, MapPin, Wallet, CloudSun, Share2, Compass, Hotel, Plane } from "lucide-react";
import heroDubaiSkyline from "@/assets/hero-dubai-skyline.jpg";
import heroDubaiDesert from "@/assets/hero-dubai-desert.jpg";
import heroDubaiPalm from "@/assets/hero-dubai-palm.jpg";
import heroNatureWalk from "@/assets/hero-nature-walk.jpg";
import destTokyo from "@/assets/dest-tokyo.jpg";
import destKyoto from "@/assets/dest-kyoto.jpg";
import destNorway from "@/assets/dest-norway.jpg";
import destSantorini from "@/assets/dest-santorini.jpg";
import destBali from "@/assets/dest-bali.jpg";
import destMarrakech from "@/assets/dest-marrakech.jpg";
import mapTokyo from "@/assets/map-tokyo.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TripGenius AI — Travel at the speed of thought" },
      { name: "description", content: "AI-powered travel planning that crafts personalized itineraries, optimizes routes, and curates stays — all in one cinematic experience." },
      { property: "og:title", content: "TripGenius AI — Travel at the speed of thought" },
      { property: "og:description", content: "AI-powered travel planning that crafts personalized itineraries, optimizes routes, and curates stays." },
    ],
  }),
  component: Landing,
});

const destinations = [
  { name: "Tokyo", country: "Japan", img: destTokyo, days: 7, price: "$2,840" },
  { name: "Kyoto", country: "Japan", img: destKyoto, days: 5, price: "$1,920" },
  { name: "Geirangerfjord", country: "Norway", img: destNorway, days: 8, price: "$3,640" },
  { name: "Santorini", country: "Greece", img: destSantorini, days: 6, price: "$2,210" },
  { name: "Ubud", country: "Bali", img: destBali, days: 10, price: "$1,580" },
  { name: "Marrakech", country: "Morocco", img: destMarrakech, days: 7, price: "$1,740" },
];

const features = [
  { icon: Sparkles, title: "AI Itineraries", desc: "Bespoke day-by-day plans tuned to your budget, pace, and interests." },
  { icon: MapPin, title: "Route Optimization", desc: "Constellation-class algorithms compute the most beautiful, efficient paths." },
  { icon: Wallet, title: "Budget Intelligence", desc: "Live expense breakdowns with currency-aware forecasts." },
  { icon: CloudSun, title: "Weather-Aware", desc: "Plans adapt to forecasts so your outdoor days actually shine." },
  { icon: Hotel, title: "Curated Stays", desc: "Hand-tuned recommendations for hotels, ryokans, and hidden gems." },
  { icon: Share2, title: "Collaborative", desc: "Plan with friends in real time. Export to wallet or share a live link." },
];

const stats = [
  { v: "1.2M+", l: "Trips Generated" },
  { v: "184", l: "Countries Mapped" },
  { v: "$42M", l: "Traveler Savings" },
  { v: "4.9★", l: "Average Rating" },
];

const testimonials = [
  { quote: "It planned a 12-day Japan trip in under a minute. We didn't change a single thing.", who: "Mira Tanaka", role: "Product Designer" },
  { quote: "The route optimizer alone saved us six hours of driving across Iceland.", who: "Jonas Berg", role: "Cinematographer" },
  { quote: "Finally an AI tool that feels like a real concierge, not a chatbot.", who: "Aisha Patel", role: "Founder, Lumen" },
];

function Landing() {
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 aurora-bg opacity-70 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-60 mix-blend-screen pointer-events-none"
          style={{ backgroundImage: `radial-gradient(ellipse at 50% 40%, rgba(59,130,246,0.18), transparent 55%)` }}
        />
        {/* Dark vignette for text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(ellipse at 50% 35%, rgba(2,6,23,0.75) 0%, rgba(2,6,23,0.25) 50%, transparent 80%)` }}
        />

        {/* Floating image cards behind the title */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top-left Dubai skyline */}
          <div
            className="absolute top-[10%] left-[4%] w-40 sm:w-56 md:w-72 glass p-1.5 rounded-2xl shadow-card opacity-60 sm:opacity-70 animate-hang"
            style={{ "--hang-rotate": "-6deg", animationDelay: "0s" } as React.CSSProperties}
          >
            <img
              src={heroDubaiSkyline}
              alt="Dubai skyline at golden hour"
              width={400}
              height={300}
              loading="lazy"
              className="w-full h-auto rounded-xl object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-background/60 backdrop-blur-sm text-[10px] font-semibold text-foreground/90">
              Dubai Skyline
            </div>
          </div>

          {/* Top-right desert dunes */}
          <div
            className="absolute top-[8%] right-[5%] w-36 sm:w-48 md:w-60 glass p-1.5 rounded-2xl shadow-card opacity-60 sm:opacity-70 animate-hang"
            style={{ "--hang-rotate": "5deg", animationDelay: "-1.2s" } as React.CSSProperties}
          >
            <img
              src={heroDubaiDesert}
              alt="Dubai desert dunes at sunset"
              width={320}
              height={240}
              loading="lazy"
              className="w-full h-auto rounded-xl object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-background/60 backdrop-blur-sm text-[10px] font-semibold text-foreground/90">
              Golden Dunes
            </div>
          </div>

          {/* Bottom-left Palm Jumeirah */}
          <div
            className="absolute bottom-[18%] left-[6%] w-32 sm:w-44 md:w-56 glass p-1.5 rounded-2xl shadow-card opacity-60 sm:opacity-70 animate-hang"
            style={{ "--hang-rotate": "-4deg", animationDelay: "-2.4s" } as React.CSSProperties}
          >
            <img
              src={heroDubaiPalm}
              alt="Palm Jumeirah aerial view"
              width={300}
              height={225}
              loading="lazy"
              className="w-full h-auto rounded-xl object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-background/60 backdrop-blur-sm text-[10px] font-semibold text-foreground/90">
              Palm Jumeirah
            </div>
          </div>

          {/* Bottom-right nature walk */}
          <div
            className="absolute bottom-[12%] right-[3%] w-40 sm:w-52 md:w-64 glass p-1.5 rounded-2xl shadow-card opacity-60 sm:opacity-70 animate-hang"
            style={{ "--hang-rotate": "6deg", animationDelay: "-3.6s" } as React.CSSProperties}
          >
            <img
              src={heroNatureWalk}
              alt="Peaceful forest nature walk"
              width={360}
              height={270}
              loading="lazy"
              className="w-full h-auto rounded-xl object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-background/60 backdrop-blur-sm text-[10px] font-semibold text-foreground/90">
              Nature Walk
            </div>
          </div>
        </div>

        {/* Foreground content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-azure/10 border border-azure/20 text-azure text-xs font-bold uppercase tracking-widest mb-8 animate-fade-up">
            <span className="size-1.5 rounded-full bg-azure animate-pulse" />
            v2.0 AI Engine Live
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-[1.02] max-w-5xl mx-auto animate-fade-up drop-shadow-2xl">
            Travel at the speed <br className="hidden sm:block" />
            <span className="text-gradient-azure">of thought.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed animate-fade-up">
            The world's most advanced AI travel engine. We don't just find flights — we craft hyper-personalized narratives for your next adventure.
          </p>

          {/* Search */}
          <div className="relative max-w-3xl mx-auto mt-12 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-azure to-azure-glow rounded-2xl blur-xl opacity-30 group-focus-within:opacity-60 transition duration-700" />
            <form
              onSubmit={(e) => { e.preventDefault(); window.location.assign("/planner"); }}
              className="relative glass-strong p-2 rounded-2xl flex flex-col sm:flex-row items-stretch gap-2"
            >
              <input
                type="text"
                placeholder="Plan a 7-day culinary tour of Tokyo on a $3k budget…"
                className="flex-1 bg-transparent px-5 py-4 outline-none text-foreground placeholder:text-muted-foreground/60"
              />
              <button className="bg-azure hover:bg-azure-glow text-white px-7 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                Generate <ArrowRight className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-hairline">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-gradient-azure">{s.v}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-2xl mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-azure mb-4">The Engine</div>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            Six systems. One intelligence.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every TripGenius itinerary runs through six AI sub-systems working in concert — the result feels effortless because the work isn't.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass rounded-2xl p-7 hover:bg-surface-strong hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="size-11 rounded-xl bg-azure/10 border border-azure/20 grid place-items-center mb-5 group-hover:bg-azure/20 transition-colors">
                <f.icon className="size-5 text-azure" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLANNER PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-azure mb-3">Live Sample</div>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Tokyo: Neon &amp; Tradition</h2>
          </div>
          <div className="hidden md:flex gap-2">
            <span className="px-3 py-1.5 rounded-lg glass text-xs">7 Days</span>
            <span className="px-3 py-1.5 rounded-lg glass text-xs">$2,840 est.</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-5">
            {[
              { day: "01", tag: "Arrival", title: "Shibuya Crossing & Hidden Izakayas", img: destTokyo, desc: "Experience the kinetic energy of the world's busiest crossing followed by a curated tour of Ebisu's subterranean food scene.", chips: ["18:00 · Gonpachi", "21:00 · Sky Deck"] },
              { day: "02", tag: "Tradition", title: "Imperial Gardens & Tea Ceremony", img: destKyoto, desc: "A morning at Shinjuku Gyoen followed by a private tea session with a certified master in a hidden chashitsu.", chips: ["09:00 · Garden Walk", "14:00 · Tea Master"] },
            ].map((d) => (
              <div key={d.day} className="group glass rounded-3xl overflow-hidden hover:bg-surface-strong transition-all">
                <div className="p-6 md:p-7 flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-56 h-44 rounded-2xl overflow-hidden shrink-0">
                    <img src={d.img} alt={d.title} width={512} height={512} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="flex-1">
                    <div className="text-azure font-bold text-xs uppercase tracking-widest mb-2">Day {d.day} · {d.tag}</div>
                    <h3 className="text-xl md:text-2xl font-display font-semibold mb-3">{d.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{d.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {d.chips.map((c) => (
                        <span key={c} className="text-xs py-1.5 px-3.5 rounded-full glass">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-5">
            <div className="glass rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display text-sm font-semibold">Route Optimization</h4>
                <span className="text-[10px] text-azure font-bold uppercase tracking-widest">Live</span>
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden relative">
                <img src={mapTokyo} alt="Tokyo route map" width={512} height={512} loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 right-3 glass-strong p-3 rounded-xl">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span>Total Distance</span>
                    <span className="text-azure">12.4 KM</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-3xl p-5">
                <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-2">Forecast</div>
                <div className="text-2xl font-display font-bold">22°C</div>
                <div className="text-xs text-muted-foreground">Clear Skies</div>
              </div>
              <div className="glass rounded-3xl p-5">
                <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-2">Daily Spend</div>
                <div className="text-2xl font-display font-bold">$142</div>
                <div className="text-xs text-muted-foreground">Under budget</div>
              </div>
            </div>
            <div className="rounded-3xl p-5 bg-gradient-to-br from-azure/20 to-transparent border border-azure/20">
              <h4 className="font-display text-sm font-semibold mb-4 flex items-center gap-2">
                <span className="size-2 bg-azure rounded-full animate-ping" />
                AI Hidden Gems
              </h4>
              <ul className="space-y-3.5">
                {[
                  { n: "01", t: "Shimokitazawa Records", d: "Vintage vinyl & coffee haunt." },
                  { n: "02", t: "Golden Gai Secret Bar", d: "No-signage whiskey specialist." },
                  { n: "03", t: "Yanaka Cemetery Path", d: "Cherry blossom hidden walk." },
                ].map((g) => (
                  <li key={g.n} className="flex gap-4">
                    <div className="size-10 rounded-lg glass grid place-items-center text-xs shrink-0">{g.n}</div>
                    <div>
                      <div className="text-sm font-medium">{g.t}</div>
                      <div className="text-xs text-muted-foreground">{g.d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 border-t border-hairline">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-azure mb-3">Explore</div>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Trending destinations</h2>
          </div>
          <Link to="/explorer" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((d) => (
            <Link
              to="/explorer"
              key={d.name}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl glass"
            >
              <img src={d.img} alt={d.name} width={1024} height={1024} loading="lazy" className="absolute inset-0 size-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-azure font-bold uppercase tracking-widest">{d.country}</div>
                  <h3 className="text-2xl font-display font-bold mt-1">{d.name}</h3>
                  <div className="text-xs text-muted-foreground mt-1">{d.days} days · from {d.price}</div>
                </div>
                <div className="size-10 rounded-full glass-strong grid place-items-center group-hover:bg-azure group-hover:border-azure transition-colors">
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-xs font-bold uppercase tracking-widest text-azure mb-3">Loved by travelers</div>
        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-12 max-w-2xl">
          A new kind of planning, in their words.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <figure key={t.who} className="glass rounded-3xl p-7">
              <div className="text-azure mb-4 text-2xl leading-none">"</div>
              <blockquote className="text-base leading-relaxed">{t.quote}</blockquote>
              <figcaption className="mt-6 pt-6 border-t border-hairline">
                <div className="text-sm font-semibold">{t.who}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-[2rem] glass-strong px-8 py-16 md:py-20 text-center">
          <div className="absolute inset-0 aurora-bg opacity-80 pointer-events-none" />
          <div className="relative">
            <Plane className="size-8 text-azure mx-auto mb-6" />
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight max-w-3xl mx-auto leading-tight">
              Your next trip is one prompt away.
            </h2>
            <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
              Tell TripGenius where your mind is wandering. We'll handle the rest — routes, stays, budget, and timing.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <Link to="/planner" className="inline-flex items-center gap-2 bg-azure hover:bg-azure-glow text-white px-7 py-3.5 rounded-full font-semibold transition-all">
                Start Planning <ArrowRight className="size-4" />
              </Link>
              <Link to="/explorer" className="inline-flex items-center gap-2 glass hover:bg-surface-strong px-7 py-3.5 rounded-full font-semibold transition-all">
                <Compass className="size-4" /> Explore destinations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
