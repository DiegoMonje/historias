"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Moon,
  Plus,
  SunMedium,
} from "lucide-react";
import type { Chapter } from "@/lib/types";

interface ChapterReaderProps {
  storySlug: string;
  storyTitle: string;
  totalChapters: number;
  chapter: Chapter;
}

type ReadingTheme = "night" | "paper" | "sepia";

export function ChapterReader({
  storySlug,
  storyTitle,
  totalChapters,
  chapter,
}: ChapterReaderProps) {
  const [theme, setTheme] = useState<ReadingTheme>("night");
  const [fontSize, setFontSize] = useState(19);
  const progress = Math.round((chapter.number / totalChapters) * 100);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "historias:v1:reading-progress",
        JSON.stringify({ storySlug, chapter: chapter.number }),
      );
    } catch {
      // La lectura continúa aunque el navegador bloquee el almacenamiento local.
    }
  }, [chapter.number, storySlug]);

  const previousChapter = chapter.number > 1 ? chapter.number - 1 : null;
  const nextChapter = chapter.number < totalChapters ? chapter.number + 1 : null;

  return (
    <div className={`reader reader--${theme}`}>
      <div className="reader-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <header className="reader-toolbar">
        <Link href={`/historias/${storySlug}`} className="reader-back">
          <ArrowLeft size={17} />
          <span>{storyTitle}</span>
        </Link>

        <div className="reader-settings" aria-label="Ajustes de lectura">
          <div className="reader-setting-group">
            <button
              type="button"
              aria-label="Reducir tamaño del texto"
              onClick={() => setFontSize((value) => Math.max(16, value - 1))}
            >
              <Minus size={15} />
            </button>
            <span>Aa</span>
            <button
              type="button"
              aria-label="Aumentar tamaño del texto"
              onClick={() => setFontSize((value) => Math.min(24, value + 1))}
            >
              <Plus size={15} />
            </button>
          </div>
          <div className="reader-setting-group reader-themes">
            <button
              type="button"
              className={theme === "night" ? "is-active" : undefined}
              onClick={() => setTheme("night")}
              aria-label="Tema oscuro"
            >
              <Moon size={15} />
            </button>
            <button
              type="button"
              className={theme === "sepia" ? "is-active" : undefined}
              onClick={() => setTheme("sepia")}
              aria-label="Tema sepia"
            >
              <span className="theme-dot theme-dot--sepia" />
            </button>
            <button
              type="button"
              className={theme === "paper" ? "is-active" : undefined}
              onClick={() => setTheme("paper")}
              aria-label="Tema claro"
            >
              <SunMedium size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className="reader-main">
        <article className="reader-article">
          <div className="reader-chapter-meta">
            Capítulo {String(chapter.number).padStart(2, "0")} de {totalChapters}
          </div>
          <h1>{chapter.title}</h1>
          <div className="reader-rule" aria-hidden="true">
            <span />
          </div>

          <div className="reader-copy" style={{ fontSize: `${fontSize}px` }}>
            {chapter.paragraphs.map((paragraph, index) => {
              const visual = chapter.visuals.find(
                (item) =>
                  item.afterParagraph === index + 1 &&
                  item.status === "published" &&
                  Boolean(item.url),
              );

              return (
                <div key={`${chapter.number}-${index}`}>
                  <p>{paragraph}</p>
                  {visual?.url ? (
                    <figure
                      className="chapter-visual"
                      style={{ aspectRatio: visual.aspectRatio }}
                    >
                      <Image
                        src={visual.url}
                        alt={visual.alt}
                        fill
                        sizes="(max-width: 760px) 100vw, 760px"
                      />
                    </figure>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="reader-finish">
            <span className="reader-finish__icon">
              <Check size={18} />
            </span>
            <p>Has terminado el capítulo {chapter.number}</p>
            <span>{progress}% de la historia</span>
          </div>

          <nav className="chapter-navigation" aria-label="Navegación entre capítulos">
            {previousChapter ? (
              <Link href={`/historias/${storySlug}/capitulo/${previousChapter}`}>
                <ArrowLeft size={17} />
                <span>
                  <small>Anterior</small>
                  Capítulo {previousChapter}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {nextChapter ? (
              <Link
                className="chapter-navigation__next"
                href={`/historias/${storySlug}/capitulo/${nextChapter}`}
              >
                <span>
                  <small>Siguiente</small>
                  Capítulo {nextChapter}
                </span>
                <ArrowRight size={17} />
              </Link>
            ) : (
              <Link className="chapter-navigation__next" href={`/historias/${storySlug}`}>
                <span>
                  <small>Historia terminada</small>
                  Volver a la ficha
                </span>
                <ArrowRight size={17} />
              </Link>
            )}
          </nav>
        </article>
      </main>
    </div>
  );
}
