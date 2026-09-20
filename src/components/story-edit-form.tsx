"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ImagePlus,
  Save,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { deleteCoverAction, updateStoryAction } from "@/app/admin/actions";
import { StoryPoster } from "@/components/story-poster";
import { initialActionState } from "@/lib/action-state";
import type { Chapter, Story, StoryGenre, StoryStatus } from "@/lib/types";

const allGenres: StoryGenre[] = [
  "Suspense",
  "Intriga",
  "Aventura",
  "Acción",
  "Ciencia ficción",
];
const allStatuses: StoryStatus[] = ["Borrador", "En curso", "Próximamente", "Completa"];

type EditableStory = Omit<Story, "chapters"> & {
  chapters: Pick<Chapter, "number" | "title" | "readingMinutes">[];
};

export function StoryEditForm({ story }: { story: EditableStory }) {
  const updateAction = updateStoryAction.bind(null, story.slug);
  const removeAction = deleteCoverAction.bind(null, story.slug);
  const [saveState, saveFormAction, saving] = useActionState(
    updateAction,
    initialActionState,
  );
  const [deleteState, deleteFormAction, deleting] = useActionState(
    removeAction,
    initialActionState,
  );
  const [selectedPreview, setSelectedPreview] = useState<string | null | undefined>();
  const [fileError, setFileError] = useState("");
  const objectUrlRef = useRef<string | null>(null);
  const preview = selectedPreview === undefined ? story.cover.url ?? null : selectedPreview;

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileError("");

    if (!file) {
      setSelectedPreview(undefined);
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      event.target.value = "";
      setFileError("El archivo debe ser JPG, PNG o WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      setFileError("La imagen no puede superar los 5 MB.");
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = URL.createObjectURL(file);
    setSelectedPreview(objectUrlRef.current);
  }

  return (
    <>
      <form action={saveFormAction} className="editor-grid">
        <section className="editor-main">
          <div className="editor-panel">
            <div className="editor-panel__heading">
              <div>
                <span className="admin-kicker">Datos principales</span>
                <h2>Presentación de la historia</h2>
              </div>
              <span className="step-pill">01</span>
            </div>
            <div className="form-grid">
              <label className="field field--wide">
                <span>Título</span>
                <input name="title" defaultValue={story.title} required />
              </label>
              <label className="field field--wide">
                <span>Subtítulo o frase promocional</span>
                <input name="tagline" defaultValue={story.tagline} />
              </label>
              <label className="field field--wide">
                <span>Antetítulo</span>
                <input name="eyebrow" defaultValue={story.eyebrow} />
              </label>
              <label className="field field--wide">
                <span>Sinopsis</span>
                <textarea name="synopsis" rows={6} defaultValue={story.synopsis} required />
              </label>
              <label className="field">
                <span>Estado de publicación</span>
                <select name="status" defaultValue={story.status}>
                  {allStatuses.map((status) => (
                    <option value={status} key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label className="checkbox-field checkbox-field--featured">
                <input name="featured" type="checkbox" defaultChecked={story.featured} />
                <Star size={18} />
                <span>Mostrar como historia destacada</span>
              </label>
              <fieldset className="genre-fieldset field--wide">
                <legend>Géneros</legend>
                <div>
                  {allGenres.map((genre) => (
                    <label className="checkbox-field" key={genre}>
                      <input
                        name="genres"
                        type="checkbox"
                        value={genre}
                        defaultChecked={story.genres.includes(genre)}
                      />
                      <span>{genre}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          <div className="editor-panel">
            <div className="editor-panel__heading">
              <div>
                <span className="admin-kicker">Contenido</span>
                <h2>Capítulos y títulos</h2>
                <p>Abre un capítulo para editar su título y su texto.</p>
              </div>
              <span className="step-pill">02</span>
            </div>
            <div className="admin-chapter-list">
              {story.chapters.map((chapter) => (
                <Link
                  href={`/admin/historias/${story.slug}/capitulo/${chapter.number}`}
                  key={chapter.number}
                >
                  <span>{String(chapter.number).padStart(2, "0")}</span>
                  <strong>{chapter.title}</strong>
                  <small>{chapter.readingMinutes} min</small>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <aside className="editor-aside">
          <div className="editor-panel editor-panel--sticky">
            <span className="admin-kicker">Portada · proporción 2:3</span>
            <div className="cover-preview">
              {preview ? (
                <Image
                  src={preview}
                  alt={story.cover.alt || `Portada de ${story.title}`}
                  fill
                  sizes="(max-width: 900px) 180px, 270px"
                  unoptimized={preview.startsWith("blob:")}
                />
              ) : (
                <StoryPoster story={story} compact />
              )}
            </div>
            <label className="cover-file-field">
              <UploadCloud size={18} />
              <span>{story.cover.url ? "Sustituir portada" : "Seleccionar portada"}</span>
              <input
                name="cover"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverChange}
              />
            </label>
            <small className="cover-help">JPG, PNG o WebP · máximo 5 MB</small>
            <label className="field cover-alt-field">
              <span>Texto alternativo</span>
              <input
                name="coverAlt"
                defaultValue={story.cover.alt || `Portada de ${story.title}`}
                placeholder="Describe la imagen de portada"
              />
            </label>
            {fileError ? <p className="form-notice form-notice--error">{fileError}</p> : null}
            <button className="button button--primary button--wide" type="submit" disabled={saving || Boolean(fileError)}>
              {saving ? <ImagePlus size={17} /> : <Save size={17} />}
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
            {saveState.message ? (
              <p className={`form-notice form-notice--${saveState.status}`} role="status">
                {saveState.message}
              </p>
            ) : null}
          </div>
        </aside>
      </form>

      {story.cover.url ? (
        <form action={deleteFormAction} className="delete-cover-form">
          <button className="button button--danger" type="submit" disabled={deleting}>
            <Trash2 size={16} /> {deleting ? "Eliminando…" : "Eliminar portada actual"}
          </button>
          {deleteState.message ? (
            <p className={`form-notice form-notice--${deleteState.status}`} role="status">
              {deleteState.message}
            </p>
          ) : null}
        </form>
      ) : null}
    </>
  );
}
