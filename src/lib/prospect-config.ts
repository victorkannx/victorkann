export const CURRENCY_SYMBOLS = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  GHS: "GH₵",
  KES: "KSh",
  ZAR: "R",
  EUR: "€",
} as const;

export type ProspectCurrency = keyof typeof CURRENCY_SYMBOLS;

export const PROSPECT_COUNTRIES = [
  { name: "Nigeria", currency: "NGN", symbol: "₦" },
  { name: "United States", currency: "USD", symbol: "$" },
  { name: "United Kingdom", currency: "GBP", symbol: "£" },
  { name: "Canada", currency: "CAD", symbol: "C$" },
  { name: "Australia", currency: "AUD", symbol: "A$" },
  { name: "Ghana", currency: "GHS", symbol: "GH₵" },
  { name: "Kenya", currency: "KES", symbol: "KSh" },
  { name: "South Africa", currency: "ZAR", symbol: "R" },
  { name: "Germany", currency: "EUR", symbol: "€" },
  { name: "France", currency: "EUR", symbol: "€" },
  { name: "Netherlands", currency: "EUR", symbol: "€" },
] as const;

export const PROSPECT_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Call Booked",
  "Proposal",
  "Client",
  "Not Now",
] as const;

export function currencyForCountry(country: string): ProspectCurrency {
  return PROSPECT_COUNTRIES.find((item) => item.name === country)?.currency ?? "USD";
}

export function currencySymbol(currency: string) {
  return CURRENCY_SYMBOLS[currency as ProspectCurrency] ?? currency;
}
export const INVESTMENT_TIERS = ["tier_1", "tier_2", "tier_3", "tier_4", "tier_5"] as const;
export type InvestmentTier = (typeof INVESTMENT_TIERS)[number];

/** Tier boundaries per currency: [t1 lo, t1 hi/t2 lo, t2 hi, t3 hi, t4 hi (t5 = this+)] */
const TIER_BOUNDS: Record<ProspectCurrency, [number, number, number, number, number]> = {
  NGN: [50_000, 100_000, 250_000, 500_000, 1_000_000],
  USD: [100, 250, 500, 1_000, 2_500],
  GBP: [100, 250, 500, 1_000, 2_500],
  EUR: [100, 250, 500, 1_000, 2_500],
  CAD: [150, 350, 700, 1_500, 3_500],
  AUD: [150, 400, 750, 1_500, 4_000],
  GHS: [1_500, 3_500, 7_500, 15_000, 35_000],
  KES: [15_000, 35_000, 70_000, 150_000, 350_000],
  ZAR: [2_000, 5_000, 10_000, 20_000, 50_000],
};

export function investmentRangesForCountry(country: string) {
  const currency = currencyForCountry(country);
  const s = currencySymbol(currency);
  const b = TIER_BOUNDS[currency];
  const f = (n: number) => `${s}${n.toLocaleString("en-US")}`;
  return INVESTMENT_TIERS.map((tier, i) => ({
    tier,
    currency,
    label: i < 4 ? `${f(b[i]!)} – ${f(b[i + 1]!)}` : `${f(b[4])}+`,
  }));
}

export function readSourceParams(search: string) {
  const p = new URLSearchParams(search);
  const get = (k: string) => p.get(k)?.trim().slice(0, 100) || null;
  return {
    source: get("source") ?? get("utm_source") ?? "Direct",
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_term: get("utm_term"),
    utm_content: get("utm_content"),
  };
}
