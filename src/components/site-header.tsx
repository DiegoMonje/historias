import Link from "next/link";
import { BookOpenText, Search } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { getPublicStories } from "@/lib/story-repository";

export async function SiteHeader() {
  const stories = await getPublicStories();
  const featuredStory = stories.find((story) => story.featured) ?? stories[0];
  const readingHref = featuredStory
    ? `/historias/${featuredStory.slug}/capitulo/1`
    : "/historias";

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/" aria-label="Ficción Oculta, página de inicio">
          <BrandLogo />
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
          <Link className="reading-link" href={readingHref}>
            <BookOpenText size={16} strokeWidth={1.8} />
            <span>Leer ahora</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
