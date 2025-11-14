import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BurnRate",
  description:
    "Private meeting cost tracker that keeps salaries on your device.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${geistMono.variable} bg-slate-950 text-white antialiased`}
      >
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[#0f172a]" />
          <div className="pointer-events-none absolute inset-0 opacity-70" />
          <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 pb-16 pt-14 sm:px-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
