import { ImageResponse } from "next/og";

export const alt = "Ficción Oculta — Historias originales";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "78px 92px",
          color: "#f2efe8",
          background:
            "radial-gradient(circle at 78% 20%, rgba(241,183,90,.18), transparent 28%), #07090b",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 720 }}>
          <div style={{ color: "#f1b75a", fontSize: 22, letterSpacing: 8 }}>
            HISTORIAS ORIGINALES
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 28 }}>
            <span style={{ fontFamily: "serif", fontSize: 102, lineHeight: 0.9 }}>Ficción</span>
            <span style={{ fontFamily: "serif", fontSize: 102, lineHeight: 0.9 }}>Oculta</span>
          </div>
          <div style={{ marginTop: 34, color: "#aaa9a5", fontSize: 26 }}>
            Suspense · Intriga · Aventura · Acción
          </div>
        </div>
        <div
          style={{
            width: 255,
            height: 360,
            display: "flex",
            position: "relative",
            border: "2px solid #e8e4da",
            background: "#0b1115",
          }}
        >
          <div style={{ position: "absolute", top: 76, left: 55, width: 132, height: 5, background: "#f1b75a" }} />
          <div style={{ position: "absolute", top: 124, left: 55, width: 96, height: 5, background: "#f1b75a" }} />
          <div style={{ position: "absolute", top: 124, left: 55, width: 5, height: 104, background: "#f1b75a" }} />
          <div style={{ position: "absolute", right: 34, bottom: 32, width: 12, height: 12, borderRadius: 99, background: "#f1b75a" }} />
        </div>
      </div>
    ),
    size,
  );
}
