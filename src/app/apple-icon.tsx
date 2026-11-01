import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          borderRadius: 0,
        }}
      >
        <svg width="129" height="129" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8.25" fill="none" stroke="#0a0a0a" strokeWidth="1.5" />
          <path d="M10 10 V3.5 A6.5 6.5 0 0 1 16.5 10 Z" fill="#e11d48" />
        </svg>
      </div>
    ),
    size,
  );
}
