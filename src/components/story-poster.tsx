import type { CSSProperties } from "react";
import type { Story } from "@/lib/types";

type PosterStyle = CSSProperties & {
  "--poster-accent": string;
  "--poster-ink": string;
};

interface StoryPosterProps {
  story: Story;
  compact?: boolean;
}

export function StoryPoster({ story, compact = false }: StoryPosterProps) {
  const style: PosterStyle = {
    "--poster-accent": story.cover.accent,
    "--poster-ink": story.cover.ink,
  };

  return (
    <div
      className={`story-poster story-poster--${story.cover.variant}${compact ? " story-poster--compact" : ""}`}
      style={style}
      aria-label={`Portada provisional de ${story.title}`}
    >
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
    </div>
  );
}
