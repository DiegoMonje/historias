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
          color: "#eee7db",
          background:
            "radial-gradient(circle at 78% 20%, rgba(142,29,42,.2), transparent 30%), #07090b",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 720 }}>
          <div style={{ color: "#aaa9a5", fontSize: 22, letterSpacing: 8 }}>
            HISTORIAS ORIGINALES
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 38 }}>
            <span style={{ fontSize: 72, fontWeight: 800, letterSpacing: 5 }}>FICCIÓN</span>
            <span
              style={{
                width: 9,
                height: 104,
                margin: "0 22px",
                background: "#8e1b2a",
                transform: "rotate(4deg)",
              }}
            />
            <span style={{ fontSize: 72, fontWeight: 800, letterSpacing: 5 }}>OCULTA</span>
          </div>
          <div style={{ marginTop: 34, color: "#aaa9a5", fontSize: 26 }}>
            Suspense · Intriga · Aventura · Acción
          </div>
        </div>
        <div
          style={{
            width: 270,
            height: 270,
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(238,231,219,.28)",
            borderRadius: 48,
            background: "#111317",
          }}
        >
          <span style={{ marginRight: -4, fontSize: 166, fontWeight: 800, lineHeight: 1 }}>F</span>
          <span
            style={{
              width: 92,
              height: 144,
              border: "11px solid #eee7db",
              borderRadius: 80,
            }}
          />
          <span
            style={{
              position: "absolute",
              width: 12,
              height: 198,
              background: "#8e1b2a",
              transform: "rotate(3deg)",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
