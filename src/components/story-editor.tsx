"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Eye,
  FileText,
  ImagePlus,
  Save,
  Sparkles,
} from "lucide-react";

function detectChapters(text: string) {
  const chunks = text
    .split(/(?=^\s*cap[ií]tulo\s+\d+)/gim)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return chunks.map((chunk, index) => {
    const [heading, ...body] = chunk.split("\n");
    return {
      number: index + 1,
      title: heading.replace(/^\s*cap[ií]tulo\s+\d+\s*[:.-]?\s*/i, "") || `Capítulo ${index + 1}`,
      words: body.join(" ").trim().split(/\s+/).filter(Boolean).length,
    };
  });
}

export function StoryEditor() {
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [chapters, setChapters] = useState<ReturnType<typeof detectChapters>>([]);
  const [notice, setNotice] = useState("");

  function handleAnalyze() {
    const detected = detectChapters(bulkText);
    setChapters(detected);
    setNotice(
      detected.length > 0
        ? `Se han detectado ${detected.length} capítulos.`
        : "No se han encontrado encabezados del tipo «Capítulo 1».",
    );
  }

  function handleSaveDraft() {
    try {
      window.localStorage.setItem(
        "historias:v1:cms-local-draft",
        JSON.stringify({ title, synopsis, bulkText, chapters, savedAt: new Date().toISOString() }),
      );
      setNotice("Borrador guardado en este navegador. Todavía no está publicado.");
    } catch {
      setNotice("El navegador ha bloqueado el guardado local. El contenido sigue en pantalla.");
    }
  }

  return (
    <div className="editor-grid">
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
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ej. La estación de las 3:17"
              />
            </label>
            <label className="field">
              <span>Género principal</span>
              <select defaultValue="Suspense">
                <option>Suspense</option>
                <option>Intriga</option>
                <option>Aventura</option>
                <option>Acción</option>
                <option>Ciencia ficción</option>
              </select>
            </label>
            <label className="field">
              <span>Estado</span>
              <select defaultValue="Borrador">
                <option>Borrador</option>
                <option>En publicación</option>
                <option>Completa</option>
              </select>
            </label>
            <label className="field field--wide">
              <span>Sinopsis</span>
              <textarea
                rows={5}
                value={synopsis}
                onChange={(event) => setSynopsis(event.target.value)}
                placeholder="Describe el punto de partida sin desvelar el desenlace."
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
          <span className="admin-kicker">Portada provisional</span>
          <button className="cover-uploader" type="button">
            <ImagePlus size={25} />
            <strong>Añadir portada</strong>
            <span>JPG, PNG o WEBP · proporción 2:3</span>
          </button>
          <div className="future-feature">
            <Sparkles size={17} />
            <div>
              <strong>Generación con IA</strong>
              <p>Este espacio queda preparado para generar la portada desde la sinopsis.</p>
            </div>
          </div>
          <div className="publish-summary">
            <div>
              <span>Estado</span>
              <strong>Borrador local</strong>
            </div>
            <div>
              <span>Capítulos</span>
              <strong>{chapters.length || 0}</strong>
            </div>
          </div>
          <button className="button button--primary button--wide" type="button" onClick={handleSaveDraft}>
            <Save size={17} /> Guardar borrador
          </button>
          <button className="button button--ghost button--wide" type="button">
            <Eye size={17} /> Vista previa
          </button>
          {notice ? <p className="editor-notice" role="status">{notice}</p> : null}
        </div>
      </aside>
    </div>
  );
}
