import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "SpendScope AI";
export const size = {
  width: 1200,
  height: 630,
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: 48,
          background:
            "radial-gradient(circle at top right, rgba(120, 240, 199, 0.24), transparent 28%), linear-gradient(135deg, #07111f, #0b1728 55%, #0c2130)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 36,
            padding: 48,
            background: "rgba(7, 17, 31, 0.72)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span
              style={{
                display: "inline-flex",
                width: "fit-content",
                padding: "10px 16px",
                borderRadius: 999,
                background: "rgba(120, 240, 199, 0.1)",
                border: "1px solid rgba(120, 240, 199, 0.2)",
                color: "#dffdf4",
                fontSize: 18,
              }}
            >
              SpendScope AI
            </span>
            <h1 style={{ fontSize: 72, lineHeight: 1, letterSpacing: "-0.06em", margin: 0, maxWidth: 900 }}>
              Audit AI spend with clarity.
            </h1>
            <p style={{ fontSize: 28, lineHeight: 1.4, margin: 0, color: "#c6d6ea", maxWidth: 900 }}>
              Honest savings, explainable recommendations, and a polished share page built for startup teams.
            </p>
          </div>

          <div style={{ display: "flex", gap: 18, fontSize: 22, color: "#9fb1c8" }}>
            <span>Rule-based logic</span>
            <span>•</span>
            <span>Shareable result pages</span>
            <span>•</span>
            <span>Premium UI</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}