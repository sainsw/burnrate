import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Mark } from "@/components/mark";
import {
  SEO_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_METADATA,
  SITE_NAME,
  SITE_URL,
  SOCIAL_IMAGE_PATH,
} from "@/lib/site-metadata";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-geist",
});

const metadataBase = new URL(SITE_URL);

export const metadata: Metadata = {
  metadataBase,
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} — ${SITE_METADATA.tagline}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  category: "productivity",
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_METADATA.tagline}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SOCIAL_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} social preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_METADATA.tagline}`,
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Canvas: a centred 1104px column (max-w-[1152px] less 2 x 24px padding).
// Two-column rows split it 7fr / 5fr with one 12px gap: 637 + 12 + 455 = 1104.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-border">
            <div className="mx-auto flex h-12 max-w-[1152px] items-center justify-between px-4 sm:px-6">
              <a
                href="/"
                className="flex items-center gap-2 text-[15px] font-medium text-ink"
              >
                <Mark />
                BurnRate
              </a>
              <p className="text-[13px] text-muted">
                Nothing leaves this device
              </p>
            </div>
          </header>
          <main className="mx-auto w-full max-w-[1152px] flex-1 px-4 pb-16 pt-8 sm:px-6 sm:pt-9">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
