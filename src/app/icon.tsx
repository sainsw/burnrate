import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 30%, #38bdf8, transparent 55%), radial-gradient(circle at 70% 20%, #fbbf24, transparent 60%), #020617",
          fontSize: 38,
        }}
      >
        <span style={{ transform: "translateY(2px)" }}>💸</span>
      </div>
    ),
    size,
  );
}
