// Lightweight static currency conversion for display. Base = USD.
// Rates are approximate; refreshed occasionally. Good enough for trip estimates.
export type CurrencyCode =
  | "USD" | "EUR" | "GBP" | "INR" | "JPY" | "AED" | "AUD" | "CAD"
  | "CHF" | "CNY" | "SGD" | "THB" | "IDR" | "MXN" | "BRL" | "ZAR"
  | "TRY" | "KRW" | "NZD" | "SEK" | "NOK";

export const CURRENCIES: { code: CurrencyCode; name: string; symbol: string; rate: number }[] = [
  { code: "USD", name: "US Dollar",        symbol: "$",    rate: 1 },
  { code: "EUR", name: "Euro",             symbol: "€",    rate: 0.92 },
  { code: "GBP", name: "British Pound",    symbol: "£",    rate: 0.78 },
  { code: "INR", name: "Indian Rupee",     symbol: "₹",    rate: 83.2 },
  { code: "JPY", name: "Japanese Yen",     symbol: "¥",    rate: 156 },
  { code: "AED", name: "UAE Dirham",       symbol: "د.إ",  rate: 3.67 },
  { code: "AUD", name: "Australian Dollar",symbol: "A$",   rate: 1.52 },
  { code: "CAD", name: "Canadian Dollar",  symbol: "C$",   rate: 1.36 },
  { code: "CHF", name: "Swiss Franc",      symbol: "Fr",   rate: 0.88 },
  { code: "CNY", name: "Chinese Yuan",     symbol: "¥",    rate: 7.24 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$",   rate: 1.34 },
  { code: "THB", name: "Thai Baht",        symbol: "฿",    rate: 36.3 },
  { code: "IDR", name: "Indonesian Rupiah",symbol: "Rp",   rate: 15800 },
  { code: "MXN", name: "Mexican Peso",     symbol: "Mex$", rate: 17.1 },
  { code: "BRL", name: "Brazilian Real",   symbol: "R$",   rate: 5.05 },
  { code: "ZAR", name: "South African Rand",symbol: "R",   rate: 18.4 },
  { code: "TRY", name: "Turkish Lira",     symbol: "₺",    rate: 32.6 },
  { code: "KRW", name: "Korean Won",       symbol: "₩",    rate: 1370 },
  { code: "NZD", name: "New Zealand Dollar",symbol: "NZ$", rate: 1.64 },
  { code: "SEK", name: "Swedish Krona",    symbol: "kr",   rate: 10.5 },
  { code: "NOK", name: "Norwegian Krone",  symbol: "kr",   rate: 10.7 },
];

export function getCurrency(code: CurrencyCode) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export function convertFromUSD(usd: number, code: CurrencyCode): number {
  return usd * getCurrency(code).rate;
}

export function formatMoney(usd: number, code: CurrencyCode): string {
  const c = getCurrency(code);
  const val = usd * c.rate;
  // Choose sensible rounding: no decimals for high-value currencies, 0-2 otherwise.
  const noDecimals = ["JPY", "KRW", "IDR", "INR", "VND", "HUF"].includes(code) || val >= 1000;
  const rounded = noDecimals ? Math.round(val) : Math.round(val * 100) / 100;
  const num = rounded.toLocaleString(undefined, {
    maximumFractionDigits: noDecimals ? 0 : 2,
  });
  return `${c.symbol}${num}`;
}
