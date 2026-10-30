import { ImageResponse } from "next/og";

export const alt = "Dingle Varshney — Software Developer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background: "#f7f7f2",
        color: "#17272b",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#087f72",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 8,
        }}
      >
        DINGLE VARSHNEY
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 800, letterSpacing: -3 }}>
          Software Developer
        </div>
        <div style={{ display: "flex", color: "#087f72", fontSize: 38, fontWeight: 700 }}>
          Projects · Skills · A little 3D world
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 23, color: "#53636a" }}>
        MCA student · Building useful web applications
      </div>
    </div>,
    size,
  );
}
