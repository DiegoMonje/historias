import type { Metadata } from "next";
import { LibraryExplorer } from "@/components/library-explorer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { stories } from "@/lib/stories";

export const metadata: Metadata = {
  title: "Biblioteca",
  description:
    "Explora historias originales de suspense, intriga, aventura y acción.",
};

export default function StoriesPage() {
  return (
    <div className="public-site">
      <SiteHeader />
      <main className="library-page page-shell">
        <header className="library-intro">
          <span className="section-kicker">Biblioteca completa</span>
          <h1>Historias para desaparecer un rato.</h1>
          <p>
            Elige un misterio, cruza la primera puerta y continúa a tu ritmo.
            Todas las historias están organizadas en veinte capítulos.
          </p>
          <div className="library-count">
            <strong>{stories.length}</strong>
            <span>historias disponibles</span>
          </div>
        </header>
        <LibraryExplorer stories={stories} />
      </main>
      <SiteFooter />
    </div>
  );
}
