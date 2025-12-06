import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { BuiltWithLove } from "@/components/built-with";
import { Footer } from "@/components/footer";
import {
  SEO_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_METADATA,
  SITE_NAME,
  SITE_URL,
  SOCIAL_IMAGE_PATH,
} from "@/lib/site-metadata";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${geistMono.variable} bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-white`}
      >
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-slate-100 to-white dark:from-[#0b1123] dark:via-[#0f172a] dark:to-[#0b1123]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-rose-50/60 to-transparent opacity-60 dark:via-white/10" />
          <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col">
            <main className="flex flex-1 flex-col gap-10 px-6 pb-16 pt-14 sm:px-10">
              {children}
            </main>
            <BuiltWithLove />
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
