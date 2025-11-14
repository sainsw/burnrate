import { ImageResponse } from "next/og";
import { SITE_METADATA, SITE_NAME, SITE_URL } from "@/lib/site-metadata";

export const runtime = "edge";
export const alt = `${SITE_NAME} social image`;

const gradient =
  "radial-gradient(circle at 20% 20%, rgba(251,191,36,0.35), transparent 50%), radial-gradient(circle at 80% 0%, rgba(248,113,113,0.35), transparent 45%), radial-gradient(circle at 50% 80%, rgba(96,165,250,0.35), transparent 60%), #020617";

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
          padding: "96px",
          backgroundImage: gradient,
          color: "#f8fafc",
          fontFamily: '"Space Grotesk", "Geist", "Inter", system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.7, letterSpacing: 8 }}>
          {SITE_URL.replace(/^https?:\/\//, "")}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 104, fontWeight: 700, letterSpacing: -2 }}>
            {SITE_NAME}
          </div>
          <div style={{ fontSize: 40, maxWidth: 780, lineHeight: 1.3 }}>
            {SITE_METADATA.tagline} Stay accountable with live cost-per-second
            insight for every meeting.
          </div>
          <div style={{ display: "flex", gap: 48, fontSize: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ opacity: 0.6 }}>Cost accuracy</span>
              <strong style={{ fontSize: 48 }}>±10ms</strong>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ opacity: 0.6 }}>Privacy</span>
              <strong style={{ fontSize: 48 }}>On-device</strong>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ opacity: 0.6 }}>Updates</span>
              <strong style={{ fontSize: 48 }}>30 fps</strong>
            </div>
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
