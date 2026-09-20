import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  FilePenLine,
  FilePlus2,
  ImageIcon,
  Pencil,
} from "lucide-react";
import { ImportStoriesButton } from "@/components/import-stories-button";
import { stories as nativeStories } from "@/lib/stories";
import { getAdminStories } from "@/lib/story-repository";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const stories = await getAdminStories();
  const totalChapters = stories.reduce((total, story) => total + story.chapters.length, 0);
  const nativeSlugs = new Set(nativeStories.map((story) => story.slug));
  const importedNativeStories = stories.filter(
    (story) => Boolean(story.id) && nativeSlugs.has(story.slug),
  ).length;
  const databaseStories = stories.filter((story) => Boolean(story.id)).length;
  const totalCovers = stories.filter((story) => Boolean(story.cover.url)).length;
  const drafts = stories.filter((story) => story.status === "Borrador").length;

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <span className="admin-kicker">Ficción Oculta · CMS</span>
          <h1>Panel editorial</h1>
          <p>Edita historias, capítulos y portadas sin tocar el código del proyecto.</p>
        </div>
        <Link className="button button--admin" href="/admin/historias/nueva">
          <FilePlus2 size={17} /> Nueva historia
        </Link>
      </header>

      {importedNativeStories < nativeStories.length ? (
        <div className="setup-banner setup-banner--action">
          <div>
            <span>Importación inicial</span>
            <p>
              Hay {importedNativeStories} de las 6 historias nativas en Supabase. La importación
              conserva los capítulos existentes y solo crea el contenido que falta.
            </p>
          </div>
          <ImportStoriesButton />
        </div>
      ) : (
        <div className="setup-banner setup-banner--success">
          <span>Supabase conectado</span>
          <p>Las seis historias nativas ya se pueden editar desde este panel.</p>
        </div>
      )}

      <section className="admin-stats" aria-label="Resumen de contenidos">
        <div>
          <BookOpen size={19} />
          <span>Historias</span>
          <strong>{stories.length}</strong>
          <small>{databaseStories} guardadas en Supabase</small>
        </div>
        <div>
          <FilePenLine size={19} />
          <span>Capítulos</span>
          <strong>{totalChapters}</strong>
          <small>Contenido editable</small>
        </div>
        <div>
          <ImageIcon size={19} />
          <span>Portadas</span>
          <strong>{totalCovers}</strong>
          <small>Imágenes personalizadas</small>
        </div>
        <div>
          <Clock3 size={19} />
          <span>Borradores</span>
          <strong>{drafts}</strong>
          <small>No visibles públicamente</small>
        </div>
      </section>

      <section className="admin-content" id="historias">
        <div className="admin-section-heading">
          <div>
            <span className="admin-kicker">Contenido</span>
            <h2>Todas las historias</h2>
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
            <span>Acción</span>
          </div>
          {stories.map((story) => (
            <div className="admin-story-row" key={story.slug}>
              {story.cover.url ? (
                <Image
                  className="mini-cover mini-cover--image"
                  src={story.cover.url}
                  alt=""
                  width={34}
                  height={51}
                />
              ) : (
                <span className={`mini-cover mini-cover--${story.cover.variant}`} />
              )}
              <span className="admin-story-table__title">
                <strong>{story.title}</strong>
                <small>{story.genres.join(" · ")}</small>
              </span>
              <span className="admin-story-status">
                <i className={story.status === "Borrador" ? "status-dot status-dot--draft" : "status-dot"} />
                {story.status}
              </span>
              <span className="admin-story-chapters">{story.chapters.length}</span>
              <Link className="edit-story-link" href={`/admin/historias/${story.slug}`}>
                <Pencil size={14} /> Editar
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
