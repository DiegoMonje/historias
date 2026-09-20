"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, FileText, ImagePlus, Save, Sparkles } from "lucide-react";
import { createStoryAction } from "@/app/admin/actions";
import { initialActionState } from "@/lib/action-state";

function detectChapters(text: string) {
  const chunks = text
    .split(/(?=^\s*cap[ií]tulo\s+\d+)/gim)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return chunks.map((chunk, index) => {
    const [heading, ...body] = chunk.split("\n");
    return {
      number: index + 1,
      title:
        heading.replace(/^\s*cap[ií]tulo\s+\d+\s*[:.-]?\s*/i, "") ||
        `Capítulo ${index + 1}`,
      words: body.join(" ").trim().split(/\s+/).filter(Boolean).length,
    };
  });
}

export function StoryEditor() {
  const [bulkText, setBulkText] = useState("");
  const [chapters, setChapters] = useState<ReturnType<typeof detectChapters>>([]);
  const [analysisNotice, setAnalysisNotice] = useState("");
  const [state, formAction, pending] = useActionState(createStoryAction, initialActionState);

  function handleAnalyze() {
    const detected = detectChapters(bulkText);
    setChapters(detected);
    setAnalysisNotice(
      detected.length > 0
        ? `Se han detectado ${detected.length} capítulos.`
        : "No se han encontrado encabezados del tipo «Capítulo 1».",
    );
  }

  return (
    <form action={formAction} className="editor-grid">
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
              <input name="title" placeholder="Ej. La casa detrás del bosque" required />
            </label>
            <label className="field field--wide">
              <span>Subtítulo o frase promocional</span>
              <input name="tagline" placeholder="Una promesa breve y sugerente" />
            </label>
            <label className="field field--wide">
              <span>Antetítulo</span>
              <input name="eyebrow" placeholder="El misterio comienza aquí" />
            </label>
            <label className="field">
              <span>Género principal</span>
              <select name="genre" defaultValue="Suspense">
                <option>Suspense</option>
                <option>Intriga</option>
                <option>Aventura</option>
                <option>Acción</option>
                <option>Ciencia ficción</option>
              </select>
            </label>
            <label className="field">
              <span>Estado</span>
              <select name="status" defaultValue="Borrador">
                <option>Borrador</option>
                <option>En curso</option>
                <option>Próximamente</option>
                <option>Completa</option>
              </select>
            </label>
            <label className="field field--wide">
              <span>Sinopsis</span>
              <textarea
                name="synopsis"
                rows={5}
                placeholder="Describe el punto de partida sin desvelar el desenlace."
                required
              />
            </label>
          </div>
        </div>

        <div className="editor-panel">
          <div className="editor-panel__heading">
            <div>
              <span className="admin-kicker">Importación inteligente</span>
              <h2>Pega la historia completa</h2>
              <p>Separaremos automáticamente los capítulos usando sus encabezados.</p>
            </div>
            <span className="step-pill">02</span>
          </div>
          <label className="field field--wide">
            <span>Texto de la historia</span>
            <textarea
              className="story-import"
              name="bulkText"
              rows={15}
              value={bulkText}
              onChange={(event) => setBulkText(event.target.value)}
              placeholder={"Capítulo 1: El aviso\n\nTexto del primer capítulo...\n\nCapítulo 2: La puerta\n\nTexto del segundo capítulo..."}
            />
          </label>
          <div className="editor-actions-row">
            <button className="button button--secondary" type="button" onClick={handleAnalyze}>
              <Sparkles size={17} /> Analizar capítulos
            </button>
            <span>{bulkText.length.toLocaleString("es-ES")} caracteres</span>
          </div>
          {analysisNotice ? <p className="editor-notice">{analysisNotice}</p> : null}
        </div>

        {chapters.length > 0 ? (
          <div className="editor-panel">
            <div className="editor-panel__heading">
              <div>
                <span className="admin-kicker">Resultado</span>
                <h2>{chapters.length} capítulos detectados</h2>
              </div>
              <CheckCircle2 className="success-icon" size={24} />
            </div>
            <div className="detected-chapters">
              {chapters.map((chapter) => (
                <div key={`${chapter.number}-${chapter.title}`}>
                  <span>{String(chapter.number).padStart(2, "0")}</span>
                  <div>
                    <strong>{chapter.title}</strong>
                    <small>{chapter.words.toLocaleString("es-ES")} palabras</small>
                  </div>
                  <FileText size={17} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <aside className="editor-aside">
        <div className="editor-panel editor-panel--sticky">
          <span className="admin-kicker">Publicación</span>
          <div className="new-story-cover-note">
            <ImagePlus size={25} />
            <strong>Portada en el siguiente paso</strong>
            <span>Al crear la historia podrás subir, sustituir o eliminar su portada.</span>
          </div>
          <div className="publish-summary">
            <div>
              <span>Destino</span>
              <strong>Supabase</strong>
            </div>
            <div>
              <span>Capítulos</span>
              <strong>{chapters.length}</strong>
            </div>
          </div>
          <button className="button button--primary button--wide" type="submit" disabled={pending}>
            <Save size={17} /> {pending ? "Creando…" : "Crear historia"}
          </button>
          {state.message ? (
            <p className={`form-notice form-notice--${state.status}`} role="alert">
              {state.message}
            </p>
          ) : null}
        </div>
      </aside>
    </form>
  );
}
