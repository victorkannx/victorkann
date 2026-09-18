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