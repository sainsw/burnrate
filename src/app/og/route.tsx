import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_URL } from "@/lib/site-metadata";

export const runtime = "edge";
export const alt = `${SITE_NAME} social image`;

// Worked example: 5 people at $50,000 a year for 30 minutes.
// 5 x 50,000 / 2,080 h = $120.19 an hour, so half an hour is $60.10.
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          backgroundColor: "#f8f8f8",
          color: "#0a0a0a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 600 }}>
          <svg width="48" height="48" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8.25" fill="none" stroke="#0a0a0a" strokeWidth="1.5" />
            <path d="M10 10 V3.5 A6.5 6.5 0 0 1 16.5 10 Z" fill="#e11d48" />
          </svg>
          {SITE_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, color: "#6b6b6b" }}>
            5 people at $50,000 a year, 30 minutes in
          </div>
          <div style={{ fontSize: 196, fontWeight: 700, letterSpacing: -8, lineHeight: 1.05 }}>
            $60.10
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              height: 16,
              borderRadius: 8,
              backgroundColor: "#e6e6e6",
            }}
          >
            <div style={{ width: "50%", borderRadius: 8, backgroundColor: "#e11d48" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, fontSize: 30, color: "#6b6b6b" }}>
            <span>What is this meeting costing?</span>
            <span>{SITE_URL.replace(/^https?:\/\//, "")}</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
