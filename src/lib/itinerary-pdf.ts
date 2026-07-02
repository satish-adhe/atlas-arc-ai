import jsPDF from "jspdf";
import type { Itinerary } from "@/lib/planner.functions";
import { formatMoney, type CurrencyCode } from "@/lib/currency";

const AZURE: [number, number, number] = [59, 130, 246];
const AZURE_DEEP: [number, number, number] = [30, 64, 175];
const INK: [number, number, number] = [15, 23, 42];
const MUTED: [number, number, number] = [100, 116, 139];
const SOFT: [number, number, number] = [241, 245, 249];
const CORAL: [number, number, number] = [244, 114, 82];
const MINT: [number, number, number] = [16, 185, 129];
const GOLD: [number, number, number] = [234, 179, 8];
const VIOLET: [number, number, number] = [139, 92, 246];

async function urlToDataURL(url: string): Promise<{ data: string; format: "JPEG" | "PNG"; w: number; h: number } | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const blob = await r.blob();
    const data = await new Promise<string>((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(String(fr.result));
      fr.onerror = () => rej(fr.error);
      fr.readAsDataURL(blob);
    });
    const dims = await new Promise<{ w: number; h: number }>((res) => {
      const img = new Image();
      img.onload = () => res({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => res({ w: 1200, h: 800 });
      img.src = data;
    });
    const format: "JPEG" | "PNG" = blob.type.includes("png") ? "PNG" : "JPEG";
    return { data, format, w: dims.w, h: dims.h };
  } catch {
    return null;
  }
}

export async function downloadItineraryPDF(
  it: Itinerary,
  currency: CurrencyCode,
  heroImageUrl?: string | null,
  dayImageUrls?: Record<number, string>,
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 44;
  const contentW = pageW - margin * 2;
  let y = margin;

  const setColor = (rgb: [number, number, number]) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  const setFill = (rgb: [number, number, number]) => doc.setFillColor(rgb[0], rgb[1], rgb[2]);

  // Pre-fetch images so async completes before save()
  const heroImg = heroImageUrl ? await urlToDataURL(heroImageUrl) : null;
  const dayImgs: Record<number, Awaited<ReturnType<typeof urlToDataURL>>> = {};
  if (dayImageUrls) {
    await Promise.all(
      Object.entries(dayImageUrls).map(async ([k, u]) => {
        if (u) dayImgs[Number(k)] = await urlToDataURL(u);
      }),
    );
  }

  const addWatermark = () => {
    doc.saveGraphicsState();
    // @ts-expect-error jsPDF GState typing
    doc.setGState(new doc.GState({ opacity: 0.05 }));
    doc.setFont("helvetica", "bold");
    doc.setFontSize(72);
    setColor(AZURE);
    doc.text("TripGenius AI", pageW / 2, pageH / 2, { align: "center", angle: 30 });
    doc.restoreGraphicsState();
    // Footer
    setFill(AZURE);
    doc.rect(0, pageH - 22, pageW, 22, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setColor([255, 255, 255]);
    doc.text("TRIPGENIUS AI · tripgenius.ai", margin, pageH - 8);
    doc.setFont("helvetica", "normal");
    const pageNum = doc.getNumberOfPages();
    doc.text(`Page ${pageNum}`, pageW - margin, pageH - 8, { align: "right" });
  };

  const newPage = () => {
    doc.addPage();
    y = margin;
    addWatermark();
  };

  const need = (h: number) => {
    if (y + h > pageH - 40) newPage();
  };

  const wrap = (text: string, size: number, style: "normal" | "bold" = "normal", color = INK, lh = 1.35, maxW = contentW) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    setColor(color);
    const lines = doc.splitTextToSize(text || "", maxW);
    const lineH = size * lh;
    for (const line of lines) {
      need(lineH + 2);
      doc.text(line, margin, y);
      y += lineH;
    }
  };

  const sectionHeader = (label: string, accent: [number, number, number] = AZURE) => {
    need(34);
    y += 6;
    setFill(accent);
    doc.rect(margin, y - 2, 4, 16, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setColor(INK);
    doc.text(label.toUpperCase(), margin + 12, y + 10, { charSpace: 1.5 });
    y += 24;
  };

  addWatermark();

  // ===== COVER =====
  // Colorful hero band with image
  const heroH = 240;
  if (heroImg) {
    try {
      doc.addImage(heroImg.data, heroImg.format, 0, 0, pageW, heroH, undefined, "FAST");
    } catch {
      setFill(AZURE);
      doc.rect(0, 0, pageW, heroH, "F");
    }
  } else {
    setFill(AZURE);
    doc.rect(0, 0, pageW, heroH, "F");
  }
  // Dark gradient overlay (approximated with stacked semi-transparent bands)
  doc.saveGraphicsState();
  // @ts-expect-error GState typing
  doc.setGState(new doc.GState({ opacity: 0.55 }));
  setFill([2, 6, 23]);
  doc.rect(0, heroH - 140, pageW, 140, "F");
  doc.restoreGraphicsState();

  // Brand chip
  setFill([255, 255, 255]);
  doc.roundedRect(margin, 30, 130, 22, 11, 11, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setColor(AZURE_DEEP);
  doc.text("✦ TRIPGENIUS AI", margin + 10, 45, { charSpace: 1 });

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  setColor([255, 255, 255]);
  const titleLines = doc.splitTextToSize(it.destination, contentW);
  let ty = heroH - 60;
  for (const line of titleLines.slice(0, 2)) {
    doc.text(line, margin, ty);
    ty += 32;
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  setColor([226, 232, 240]);
  const sumLines = doc.splitTextToSize(it.summary, contentW);
  doc.text(sumLines.slice(0, 2), margin, ty);

  y = heroH + 24;

  // Meta pills
  const metas: [string, string, [number, number, number]][] = [
    ["DAYS", String(it.days.length), AZURE],
    ["CITIES", String(it.cities.length), VIOLET],
    ["BUDGET", formatMoney(it.estimatedBudgetUSD, currency), MINT],
    ["BEST TIME", it.bestTime.split(",")[0] || it.bestTime, GOLD],
  ];
  const pillW = (contentW - 12 * 3) / 4;
  metas.forEach(([label, val, color], i) => {
    const x = margin + i * (pillW + 12);
    setFill([...color, ] as [number, number, number]);
    doc.saveGraphicsState();
    // @ts-expect-error GState typing
    doc.setGState(new doc.GState({ opacity: 0.12 }));
    doc.roundedRect(x, y, pillW, 60, 10, 10, "F");
    doc.restoreGraphicsState();
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.8);
    doc.roundedRect(x, y, pillW, 60, 10, 10, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setColor(color);
    doc.text(label, x + 12, y + 18, { charSpace: 1.2 });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    setColor(INK);
    const v = doc.splitTextToSize(val, pillW - 20);
    doc.text(v[0] ?? "", x + 12, y + 40);
  });
  y += 78;

  // Route
  if (it.cities.length) {
    sectionHeader("Route", CORAL);
    wrap(it.cities.join("   →   "), 12, "bold", INK);
    y += 4;
  }

  // Weather
  sectionHeader("Weather", GOLD);
  wrap(it.weather, 10, "normal", INK);
  y += 4;

  // Budget
  sectionHeader("Budget breakdown", MINT);
  const bb = it.budgetBreakdown;
  const items: [string, number, [number, number, number]][] = [
    ["Stay", bb.stay, AZURE],
    ["Food", bb.food, CORAL],
    ["Transport", bb.transport, VIOLET],
    ["Activities", bb.activities, MINT],
    ["Misc", bb.misc, GOLD],
  ];
  const total = items.reduce((s, [, v]) => s + v, 0) || 1;
  items.forEach(([label, val, color]) => {
    need(26);
    const pct = Math.round((val / total) * 100);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(INK);
    doc.text(label, margin, y);
    doc.setFont("helvetica", "normal");
    setColor(MUTED);
    doc.text(`${formatMoney(val, currency)}  ·  ${pct}%`, margin + contentW, y, { align: "right" });
    y += 6;
    setFill(SOFT);
    doc.roundedRect(margin, y, contentW, 6, 3, 3, "F");
    setFill(color);
    const w = Math.max(4, (contentW * pct) / 100);
    doc.roundedRect(margin, y, w, 6, 3, 3, "F");
    y += 16;
  });

  // ===== DAYS (new page for breathing room) =====
  newPage();
  sectionHeader("Day by day", AZURE);
  it.days.forEach((d) => {
    need(110);
    // Card background
    const cardTop = y - 4;
    setFill([255, 255, 255]);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.6);
    // Day number badge
    setFill(AZURE);
    doc.roundedRect(margin, cardTop, 44, 44, 8, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setColor([191, 219, 254]);
    doc.text("DAY", margin + 22, cardTop + 16, { align: "center", charSpace: 1 });
    doc.setFontSize(18);
    setColor([255, 255, 255]);
    doc.text(String(d.day), margin + 22, cardTop + 36, { align: "center" });

    // Day image (right)
    const imgW = 100;
    const imgH = 70;
    const img = dayImgs[d.day];
    if (img) {
      try {
        doc.addImage(img.data, img.format, margin + contentW - imgW, cardTop, imgW, imgH, undefined, "FAST");
      } catch { /* ignore */ }
    }

    // Tag + city
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setColor(CORAL);
    doc.text(`${d.tag.toUpperCase()}  ·  ${d.city.toUpperCase()}`, margin + 56, cardTop + 14, { charSpace: 1 });
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    setColor(INK);
    const titleMax = contentW - 56 - imgW - 12;
    const tLines = doc.splitTextToSize(d.title, titleMax);
    doc.text(tLines.slice(0, 2), margin + 56, cardTop + 30);
    y = cardTop + 30 + tLines.slice(0, 2).length * 16 + 4;

    // Description
    wrap(d.description, 10, "normal", MUTED, 1.4);
    y += 4;

    // Slots
    const slots: [string, string, [number, number, number]][] = [
      ["Morning", d.morning, GOLD],
      ["Afternoon", d.afternoon, AZURE],
      ["Evening", d.evening, VIOLET],
    ];
    slots.forEach(([lbl, val, c]) => {
      need(24);
      setFill(c);
      doc.circle(margin + 3, y - 3, 2.2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      setColor(c);
      doc.text(lbl.toUpperCase(), margin + 10, y, { charSpace: 1 });
      y += 11;
      wrap(val, 10, "normal", INK, 1.4);
      y += 3;
    });

    // Divider
    y += 6;
    setFill(SOFT);
    doc.rect(margin, y, contentW, 0.8, "F");
    y += 14;
  });

  // ===== Lists =====
  const listBlock = (label: string, accent: [number, number, number], rows: string[]) => {
    if (!rows.length) return;
    sectionHeader(label, accent);
    rows.forEach((r) => {
      need(18);
      setFill(accent);
      doc.circle(margin + 3, y - 3, 1.8, "F");
      wrap(`   ${r}`, 10, "normal", INK, 1.4);
      y += 3;
    });
    y += 4;
  };
  listBlock(
    "Where to stay",
    AZURE,
    it.hotels.map((h) => `${h.name} — ${h.city} · ${h.vibe} · ${formatMoney(h.pricePerNightUSD, currency)}/night`),
  );
  listBlock("Eat here", CORAL, it.restaurants.map((r) => `${r.name} — ${r.city} · ${r.cuisine}`));
  listBlock("Must-see", VIOLET, it.attractions.map((a) => `${a.name} — ${a.city} · ${a.type}`));
  listBlock("Hidden gems", MINT, it.hiddenGems.map((g) => `${g.name} — ${g.city} · ${g.why}`));

  const safe = it.destination.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "trip";
  doc.save(`tripgenius-${safe}.pdf`);
}
