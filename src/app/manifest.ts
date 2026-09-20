import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ficción Oculta",
    short_name: "Ficción Oculta",
    description:
      "Historias originales de suspense, intriga, aventura y acción por capítulos.",
    start_url: "/",
    display: "standalone",
    background_color: "#07090b",
    theme_color: "#07090b",
    icons: [
      {
        src: "/brand/ficcion-oculta-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
