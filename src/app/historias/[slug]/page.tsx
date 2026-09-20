import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoryPoster } from "@/components/story-poster";
import { getStory, stories } from "@/lib/stories";

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);

  if (!story) return {};

  return {
    title: story.title,
    description: story.synopsis,
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStory(slug);

  if (!story) notFound();

  return (
    <div className="public-site">
      <SiteHeader />
      <main>
        <section className="story-detail page-shell">
          <Link className="breadcrumb-link" href="/historias">
            <ArrowLeft size={16} /> Volver a la biblioteca
          </Link>
          <div className="story-detail__grid">
            <div className="story-detail__poster">
              <StoryPoster story={story} />
            </div>
            <div className="story-detail__copy">
              <div className="feature-label">
                <span /> {story.status} · {story.year}
              </div>
              <p className="feature-eyebrow">{story.eyebrow}</p>
              <h1>{story.title}</h1>
              <p className="story-detail__tagline">{story.tagline}</p>
              <p className="story-detail__synopsis">{story.synopsis}</p>
              <div className="story-detail__stats">
                <div>
                  <BookOpenText size={18} />
                  <span>
                    <strong>{story.chapters.length}</strong>
                    capítulos
                  </span>
                </div>
                <div>
                  <Clock3 size={18} />
                  <span>
                    <strong>{story.totalReadingMinutes} min</strong>
                    lectura total
                  </span>
                </div>
                <div>
                  <CheckCircle2 size={18} />
                  <span>
                    <strong>{story.status}</strong>
                    estado
                  </span>
                </div>
              </div>
              <Link
                className="button button--light story-detail__button"
                href={`/historias/${story.slug}/capitulo/1`}
              >
                Comenzar la historia <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section className="chapters-section page-shell">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Temporada completa</span>
              <h2>Veinte capítulos. Una sola salida.</h2>
            </div>
            <span className="chapters-total">{story.chapters.length} episodios</span>
          </div>
          <div className="chapter-list">
            {story.chapters.map((chapter) => (
              <Link
                href={`/historias/${story.slug}/capitulo/${chapter.number}`}
                key={chapter.number}
              >
                <span className="chapter-list__number">
                  {String(chapter.number).padStart(2, "0")}
                </span>
                <span className="chapter-list__name">
                  <strong>{chapter.title}</strong>
                  <small>{chapter.readingMinutes} min de lectura</small>
                </span>
                <span className="chapter-list__action">
                  Leer <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
