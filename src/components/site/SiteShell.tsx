import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16 md:pt-20">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-hairline">
      <div className="absolute inset-0 aurora-bg opacity-50 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-14">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-azure/10 border border-azure/20 text-azure text-xs font-bold uppercase tracking-widest mb-6">
            <span className="size-1.5 rounded-full bg-azure animate-pulse" />
            {eyebrow}
          </div>
        )}
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight max-w-4xl leading-[1.05]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
