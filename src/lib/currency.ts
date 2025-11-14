const regionCurrencyMap: Record<string, string> = {
  US: "USD",
  CA: "CAD",
  GB: "GBP",
  AU: "AUD",
  NZ: "NZD",
  EU: "EUR",
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  IE: "EUR",
  PT: "EUR",
  FI: "EUR",
  GR: "EUR",
  SG: "SGD",
  CH: "CHF",
  JP: "JPY",
  CN: "CNY",
  HK: "HKD",
  TW: "TWD",
  KR: "KRW",
  IN: "INR",
  BR: "BRL",
  MX: "MXN",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  ZA: "ZAR",
};

export const supportedCurrencies = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "NZD",
  "JPY",
  "INR",
  "CNY",
  "SGD",
  "CHF",
  "BRL",
  "MXN",
  "SEK",
  "DKK",
  "NOK",
];

export function detectCurrency(locale?: string): string {
  if (!locale) return "USD";
  const parts = locale.split(/[-_]/);
  const region = parts[1]?.toUpperCase();
  if (region && regionCurrencyMap[region]) {
    return regionCurrencyMap[region];
  }
  const language = parts[0]?.toUpperCase();
  if (language && regionCurrencyMap[language]) {
    return regionCurrencyMap[language];
  }
  return "USD";
}

export function getCurrencySymbol(currency: string): string {
  try {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const parts = formatter
      .formatToParts(0)
      .find((part) => part.type === "currency");
    return parts?.value ?? currency;
  } catch {
    return currency;
  }
}

export function formatCurrency(
  value: number,
  currency: string,
  fractionDigits = 2,
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(fractionDigits)}`;
  }
}

export function splitCost(value: number): { major: string; minor: string } {
  const normalized = value.toFixed(4);
  return {
    major: normalized.slice(0, -2),
    minor: normalized.slice(-2),
  };
}
