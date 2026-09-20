import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Story } from "@/lib/types";
import { StoryPoster } from "@/components/story-poster";

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <article className="story-card">
      <Link className="story-card__poster-link" href={`/historias/${story.slug}`}>
        <StoryPoster story={story} compact />
      </Link>
      <div className="story-card__body">
        <div className="story-card__meta">
          <span>{story.genres.slice(0, 2).join(" · ")}</span>
          <span>{story.status}</span>
        </div>
        <h3>
          <Link href={`/historias/${story.slug}`}>{story.title}</Link>
        </h3>
        <p>{story.tagline}</p>
        <Link className="text-link" href={`/historias/${story.slug}`}>
          Ver historia <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}
