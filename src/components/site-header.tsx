import Link from "next/link";
import { BookOpenText, Search } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/" aria-label="Historias, página de inicio">
          <span className="brand__mark" aria-hidden="true">
            <span />
          </span>
          <span>HISTORIAS</span>
        </Link>

        <nav className="main-nav" aria-label="Navegación principal">
          <Link href="/">Inicio</Link>
          <Link href="/historias">Biblioteca</Link>
          <Link href="/historias#generos">Géneros</Link>
        </nav>

        <div className="header-actions">
          <Link className="icon-link" href="/historias" aria-label="Buscar historias">
            <Search size={18} strokeWidth={1.8} />
          </Link>
          <Link className="reading-link" href="/historias/la-estacion-de-las-317/capitulo/1">
            <BookOpenText size={16} strokeWidth={1.8} />
            <span>Leer ahora</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
