export const SITE_NAME = "BurnRate";
export const SITE_TAGLINE = "Private, real-time meeting cost tracker.";
export const SITE_DESCRIPTION =
  "BurnRate is a privacy-first meeting cost tracker that keeps salaries on-device while displaying a precise, drift-free timer.";

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://burnrate.ainsworth.dev";

export const SITE_URL = rawSiteUrl;
export const SEO_KEYWORDS = [
  "meeting cost tracker",
  "meeting timer",
  "real time meeting cost",
  "salary burn calculator",
  "BurnRate",
  "cost per meeting",
  "meeting ROI",
];
export const SOCIAL_IMAGE_PATH = "/og";
export const SITE_METADATA = {
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  tagline: SITE_TAGLINE,
} as const;

export const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "en-US",
  featureList: [
    "20-30fps drift-free timer",
    "Client-side session storage",
    "Instant cost-per-attendee summaries",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
} as const;
