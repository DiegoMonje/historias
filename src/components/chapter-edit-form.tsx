"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateChapterAction } from "@/app/admin/actions";
import { initialActionState } from "@/lib/action-state";
import type { Chapter } from "@/lib/types";

export function ChapterEditForm({
  slug,
  chapter,
}: {
  slug: string;
  chapter: Chapter;
}) {
  const action = updateChapterAction.bind(null, slug, chapter.number);
  const [state, formAction, pending] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="editor-panel chapter-editor-form">
      <div className="form-grid">
        <label className="field field--wide">
          <span>Título del capítulo</span>
          <input name="title" defaultValue={chapter.title} required />
        </label>
        <label className="field chapter-reading-field">
          <span>Minutos de lectura</span>
          <input
            name="readingMinutes"
            type="number"
            min={1}
            max={120}
            defaultValue={chapter.readingMinutes}
            required
          />
        </label>
        <label className="field field--wide">
          <span>Texto · separa cada párrafo con una línea en blanco</span>
          <textarea
            className="chapter-content-editor"
            name="content"
            rows={28}
            defaultValue={chapter.paragraphs.join("\n\n")}
            required
          />
        </label>
      </div>
      <div className="chapter-editor-actions">
        <button className="button button--primary" type="submit" disabled={pending}>
          <Save size={17} /> {pending ? "Guardando…" : "Guardar capítulo"}
        </button>
        {state.message ? (
          <p className={`form-notice form-notice--${state.status}`} role="status">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
