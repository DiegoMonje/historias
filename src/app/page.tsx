import Link from "next/link";
import { ArrowRight, BookOpenText, Clock3 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoryCard } from "@/components/story-card";
import { StoryPoster } from "@/components/story-poster";
import { getFeaturedStory, stories } from "@/lib/stories";

export default function Home() {
  const featuredStory = getFeaturedStory();

  return (
    <div className="public-site">
      <SiteHeader />
      <main>
        <section className="feature-section page-shell">
          <div className="feature-copy">
            <div className="feature-label">
              <span /> Historia destacada · {featuredStory.status}
            </div>
            <p className="feature-eyebrow">{featuredStory.eyebrow}</p>
            <h1>{featuredStory.title}</h1>
            <p className="feature-tagline">{featuredStory.tagline}</p>
            <p className="feature-synopsis">{featuredStory.synopsis}</p>
            <div className="feature-meta">
              <span>{featuredStory.genres.join(" · ")}</span>
              <span>
                <BookOpenText size={15} /> {featuredStory.chapters.length} capítulos
              </span>
              <span>
                <Clock3 size={15} /> {featuredStory.totalReadingMinutes} min
              </span>
            </div>
            <div className="feature-actions">
              <Link
                className="button button--light"
                href={`/historias/${featuredStory.slug}/capitulo/1`}
              >
                Empezar a leer <ArrowRight size={17} />
              </Link>
              <Link
                className="button button--outline"
                href={`/historias/${featuredStory.slug}`}
              >
                Ver los capítulos
              </Link>
            </div>
          </div>

          <div className="feature-visual">
            <div className="feature-poster-wrap">
              <StoryPoster story={featuredStory} />
              <div className="feature-orbit" aria-hidden="true" />
            </div>
            <div className="feature-note">
              <span>01</span>
              <p>
                Cada historia está diseñada para leerse como una temporada: capítulos
                breves, tensión continua y un final cerrado.
              </p>
            </div>
          </div>
        </section>

        <section className="catalog-section page-shell">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Biblioteca original</span>
              <h2>Elige tu próxima obsesión.</h2>
            </div>
            <Link className="section-link" href="/historias">
              Ver todas <ArrowRight size={16} />
            </Link>
          </div>
          <div className="story-grid">
            {stories.slice(0, 4).map((story) => (
              <StoryCard story={story} key={story.slug} />
            ))}
          </div>
        </section>

        <section className="genre-marquee" aria-label="Géneros disponibles">
          <div>
            <span>Suspense</span>
            <i />
            <span>Intriga</span>
            <i />
            <span>Aventura</span>
            <i />
            <span>Acción</span>
            <i />
            <span>Ciencia ficción</span>
          </div>
        </section>

        <section className="latest-section page-shell">
          <div className="section-heading section-heading--compact">
            <div>
              <span className="section-kicker">En desarrollo</span>
              <h2>Nuevos mundos, la misma oscuridad.</h2>
            </div>
          </div>
          <div className="story-grid story-grid--two">
            {stories.slice(4).map((story) => (
              <StoryCard story={story} key={story.slug} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
