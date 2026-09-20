import Image from "next/image";
import type { CSSProperties } from "react";
import type { Story } from "@/lib/types";

type PosterStyle = CSSProperties & {
  "--poster-accent": string;
  "--poster-ink": string;
};

interface StoryPosterProps {
  story: Pick<Story, "title" | "genres" | "year" | "cover">;
  compact?: boolean;
}

export function StoryPoster({ story, compact = false }: StoryPosterProps) {
  const style: PosterStyle = {
    "--poster-accent": story.cover.accent,
    "--poster-ink": story.cover.ink,
  };

  return (
    <div
      className={`story-poster story-poster--${story.cover.variant}${story.cover.url ? " story-poster--uploaded" : ""}${compact ? " story-poster--compact" : ""}`}
      style={style}
    >
      {story.cover.url ? (
        <Image
          className="story-poster__image"
          src={story.cover.url}
          alt={story.cover.alt || `Portada de ${story.title}`}
          fill
          sizes={compact ? "(max-width: 680px) 45vw, 260px" : "(max-width: 680px) 80vw, 390px"}
        />
      ) : (
        <>
          <div className="story-poster__grain" aria-hidden="true" />
          <div className="story-poster__signal" aria-hidden="true" />
          <div className="story-poster__topline">
            <span>Una historia original</span>
            <span>{story.cover.code}</span>
          </div>
          <div className="story-poster__title">
            <span>{story.genres[0]}</span>
            <strong>{story.title}</strong>
          </div>
          <div className="story-poster__index">H—{String(story.year).slice(2)}</div>
        </>
      )}
    </div>
  );
}
