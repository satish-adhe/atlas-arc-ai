import { Link } from "@tanstack/react-router";
import { Moon, Sun, Sparkles, Home } from "lucide-react";
import { useTheme } from "@/components/site/theme-provider";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/planner", label: "Planner" },
  { to: "/explorer", label: "Explorer" },
  { to: "/map", label: "Route Map" },
  { to: "/budget", label: "Budget" },
  { to: "/hotels", label: "Stays" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

export function Header() {
  const { theme, toggle } = useTheme();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-hairline bg-background/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="size-8 bg-azure rounded-lg rotate-12 flex items-center justify-center shadow-glow group-hover:rotate-45 transition-transform duration-500">
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg md:text-xl tracking-tight">
            TripGenius<span className="text-azure">.AI</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          {links.map((l) => {
            const Icon = "icon" in l ? l.icon : null;
            return (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={l.to === "/" ? { exact: true } : undefined}
                activeProps={{ className: "text-foreground" }}
                className="hover:text-foreground transition-colors relative inline-flex items-center gap-1.5"
              >
                {Icon ? <Icon className="size-4" /> : null}
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="size-9 grid place-items-center rounded-full glass hover:bg-surface-strong transition-colors"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <Link
            to="/planner"
            className="hidden sm:inline-flex px-4 py-2 bg-foreground text-background text-sm font-semibold rounded-full hover:bg-azure hover:text-white transition-all"
          >
            Start Planning
          </Link>
        </div>
      </div>
    </nav>
  );
}
