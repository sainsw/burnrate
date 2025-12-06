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
          backgroundColor: "#020617",
          backgroundImage:
            "radial-gradient(circle at 30% 30%, #38bdf8 0%, transparent 55%), radial-gradient(circle at 70% 20%, #fbbf24 0%, transparent 60%)",
          fontSize: 110,
        }}
      >
        <span style={{ transform: "translateY(8px)" }}>💸</span>
      </div>
    ),
    size,
  );
}
