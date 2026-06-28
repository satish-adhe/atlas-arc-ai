import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-hairline mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="size-7 bg-azure rounded-lg rotate-12 grid place-items-center">
              <Sparkles className="size-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-lg">TripGenius<span className="text-azure">.AI</span></span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            The world's most advanced AI travel engine. Crafted itineraries, optimized routes, real intelligence.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-azure mb-4">Product</p>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/planner" className="hover:text-foreground transition-colors">Planner</Link></li>
            <li><Link to="/explorer" className="hover:text-foreground transition-colors">Explorer</Link></li>
            <li><Link to="/map" className="hover:text-foreground transition-colors">Route Map</Link></li>
            <li><Link to="/budget" className="hover:text-foreground transition-colors">Budget</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-azure mb-4">Account</p>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
            <li><Link to="/saved" className="hover:text-foreground transition-colors">Saved Trips</Link></li>
            <li><Link to="/hotels" className="hover:text-foreground transition-colors">Stays</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-azure mb-4">Company</p>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 TripGenius AI. Built for the future of travel.</p>
          <p>Engineered with intelligence, designed for wanderers.</p>
        </div>
      </div>
    </footer>
  );
}
