import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  FilePenLine,
  FilePlus2,
  ImageIcon,
} from "lucide-react";
import { stories } from "@/lib/stories";

export default function AdminPage() {
  const totalChapters = stories.reduce((total, story) => total + story.chapters.length, 0);

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <span className="admin-kicker">Resumen editorial</span>
          <h1>Buenas tardes, Diego.</h1>
          <p>Este es el espacio donde prepararás y publicarás todas las historias.</p>
        </div>
        <Link className="button button--admin" href="/admin/historias/nueva">
          <FilePlus2 size={17} /> Nueva historia
        </Link>
      </header>

      <div className="setup-banner">
        <span>Primera versión</span>
        <p>
          La interfaz ya está preparada. El acceso privado, las publicaciones y las imágenes
          se activarán cuando conectemos Supabase.
        </p>
      </div>

      <section className="admin-stats" aria-label="Resumen de contenidos">
        <div>
          <BookOpen size={19} />
          <span>Historias</span>
          <strong>{stories.length}</strong>
          <small>Contenido de demostración</small>
        </div>
        <div>
          <FilePenLine size={19} />
          <span>Capítulos</span>
          <strong>{totalChapters}</strong>
          <small>20 por cada historia</small>
        </div>
        <div>
          <ImageIcon size={19} />
          <span>Imágenes</span>
          <strong>0</strong>
          <small>Estructura preparada</small>
        </div>
        <div>
          <Clock3 size={19} />
          <span>Borradores</span>
          <strong>2</strong>
          <small>Pendientes de revisión</small>
        </div>
      </section>

      <section className="admin-content" id="historias">
        <div className="admin-section-heading">
          <div>
            <span className="admin-kicker">Contenido</span>
            <h2>Historias recientes</h2>
          </div>
          <Link href="/historias">
            Ver biblioteca <ArrowRight size={15} />
          </Link>
        </div>
        <div className="admin-story-table">
          <div className="admin-story-table__head">
            <span>Historia</span>
            <span>Estado</span>
            <span>Capítulos</span>
            <span>Última edición</span>
          </div>
          {stories.map((story, index) => (
            <Link href={`/historias/${story.slug}`} key={story.slug}>
              <span className={`mini-cover mini-cover--${story.cover.variant}`} />
              <span className="admin-story-table__title">
                <strong>{story.title}</strong>
                <small>{story.genres.join(" · ")}</small>
              </span>
              <span>
                <i className={story.status === "Completa" ? "status-dot" : "status-dot status-dot--draft"} />
                {story.status}
              </span>
              <span>{story.chapters.length}</span>
              <span>{index === 0 ? "Hoy" : `Hace ${index + 1} días`}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
