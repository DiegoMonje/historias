"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Story, StoryGenre } from "@/lib/types";
import { StoryCard } from "@/components/story-card";

const filters: Array<"Todas" | StoryGenre> = [
  "Todas",
  "Suspense",
  "Intriga",
  "Aventura",
  "Acción",
  "Ciencia ficción",
];

export function LibraryExplorer({ stories }: { stories: Story[] }) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Todas");
  const [query, setQuery] = useState("");

  const visibleStories = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");

    return stories.filter((story) => {
      const matchesGenre =
        activeFilter === "Todas" || story.genres.includes(activeFilter);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        story.title.toLocaleLowerCase("es").includes(normalizedQuery) ||
        story.synopsis.toLocaleLowerCase("es").includes(normalizedQuery);

      return matchesGenre && matchesQuery;
    });
  }, [activeFilter, query, stories]);

  return (
    <>
      <div className="library-tools" id="generos">
        <div className="filter-list" aria-label="Filtrar por género">
          {filters.map((filter) => (
            <button
              className={activeFilter === filter ? "is-active" : undefined}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Buscar historias</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar una historia"
          />
        </label>
      </div>

      {visibleStories.length > 0 ? (
        <div className="story-grid story-grid--library">
          {visibleStories.map((story) => (
            <StoryCard story={story} key={story.slug} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span>Sin coincidencias</span>
          <h2>No hemos encontrado esa historia.</h2>
          <p>Prueba con otro título o selecciona un género diferente.</p>
        </div>
      )}
    </>
  );
}
