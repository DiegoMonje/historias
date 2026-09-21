import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getStory as getLocalStory, stories as localStories } from "@/lib/stories";
import type {
  Chapter,
  ChapterVisual,
  CoverVariant,
  Story,
  StoryGenre,
  StoryStatus,
} from "@/lib/types";

type DatabaseStoryStatus = "draft" | "in_progress" | "published" | "complete";

interface StoryRow {
  id: string;
  slug: string;
  title: string;
  eyebrow: string | null;
  tagline: string | null;
  synopsis: string;
  author: string;
  status: DatabaseStoryStatus;
  year: number;
  cover_url: string | null;
  cover_prompt: string | null;
  cover_alt: string | null;
  cover_variant: CoverVariant;
  cover_accent: string;
  cover_ink: string;
  cover_code: string;
  total_reading_minutes: number;
  featured: boolean;
}

interface GenreRow {
  story_id: string;
  genres: { name: StoryGenre } | { name: StoryGenre }[] | null;
}

interface ChapterRow {
  id: string;
  story_id: string;
  number: number;
  title: string;
  content: unknown;
  reading_minutes: number;
}

interface MediaRow {
  id: string;
  chapter_id: string;
  after_block: number;
  image_url: string | null;
  alt_text: string;
  generation_prompt: string | null;
  aspect_ratio: ChapterVisual["aspectRatio"];
  status: ChapterVisual["status"] | "archived";
}

export function toDatabaseStatus(status: StoryStatus): DatabaseStoryStatus {
  return {
    Borrador: "draft",
    "En curso": "in_progress",
    Próximamente: "published",
    Completa: "complete",
  }[status] as DatabaseStoryStatus;
}

export function fromDatabaseStatus(status: DatabaseStoryStatus): StoryStatus {
  const statusMap: Record<DatabaseStoryStatus, StoryStatus> = {
    draft: "Borrador",
    in_progress: "En curso",
    published: "Próximamente",
    complete: "Completa",
  };

  return statusMap[status];
}

function asParagraphs(content: unknown): string[] {
  if (!Array.isArray(content)) return [];
  return content.filter((paragraph): paragraph is string => typeof paragraph === "string");
}

function genreName(row: GenreRow) {
  if (Array.isArray(row.genres)) return row.genres[0]?.name;
  return row.genres?.name;
}

async function loadStories(client: SupabaseClient): Promise<Story[]> {
  const { data: storyData, error: storyError } = await client
    .from("stories")
    .select(
      "id, slug, title, eyebrow, tagline, synopsis, author, status, year, cover_url, cover_prompt, cover_alt, cover_variant, cover_accent, cover_ink, cover_code, total_reading_minutes, featured",
    )
    .order("featured", { ascending: false })
    .order("created_at", { ascending: true });

  if (storyError) throw storyError;

  const storyRows = (storyData ?? []) as StoryRow[];
  if (storyRows.length === 0) return [];

  const storyIds = storyRows.map((story) => story.id);
  const [{ data: genreData, error: genreError }, { data: chapterData, error: chapterError }] =
    await Promise.all([
      client
        .from("story_genres")
        .select("story_id, genres(name)")
        .in("story_id", storyIds),
      client
        .from("chapters")
        .select("id, story_id, number, title, content, reading_minutes")
        .in("story_id", storyIds)
        .order("number", { ascending: true }),
    ]);

  if (genreError) throw genreError;
  if (chapterError) throw chapterError;

  const chapterRows = (chapterData ?? []) as ChapterRow[];
  const chapterIds = chapterRows.map((chapter) => chapter.id);
  let mediaRows: MediaRow[] = [];

  if (chapterIds.length > 0) {
    const { data: mediaData, error: mediaError } = await client
      .from("chapter_media")
      .select(
        "id, chapter_id, after_block, image_url, alt_text, generation_prompt, aspect_ratio, status",
      )
      .in("chapter_id", chapterIds)
      .order("sort_order", { ascending: true });

    if (mediaError) throw mediaError;
    mediaRows = (mediaData ?? []) as MediaRow[];
  }

  const genreRows = (genreData ?? []) as GenreRow[];

  return storyRows.map((row) => {
    const fallback = getLocalStory(row.slug);
    const chapters: Chapter[] = chapterRows
      .filter((chapter) => chapter.story_id === row.id)
      .map((chapter) => ({
        id: chapter.id,
        number: chapter.number,
        title: chapter.title,
        readingMinutes: chapter.reading_minutes,
        paragraphs: asParagraphs(chapter.content),
        visuals: mediaRows
          .filter((media) => media.chapter_id === chapter.id && media.status !== "archived")
          .map((media) => ({
            id: media.id,
            afterParagraph: media.after_block,
            alt: media.alt_text,
            prompt: media.generation_prompt ?? "",
            aspectRatio: media.aspect_ratio,
            status: media.status === "published" ? "published" : "pending",
            url: media.image_url,
          })),
      }));

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      eyebrow: row.eyebrow ?? "",
      tagline: row.tagline ?? "",
      synopsis: row.synopsis,
      genres: genreRows
        .filter((genre) => genre.story_id === row.id)
        .map(genreName)
        .filter((genre): genre is StoryGenre => Boolean(genre)),
      status: fromDatabaseStatus(row.status),
      year: row.year,
      author: row.author,
      totalReadingMinutes: row.total_reading_minutes,
      featured: row.featured,
      cover: {
        variant: row.cover_variant ?? fallback?.cover.variant ?? "signal",
        accent: row.cover_accent ?? fallback?.cover.accent ?? "#f1b75a",
        ink: row.cover_ink ?? fallback?.cover.ink ?? "#071319",
        code: row.cover_code ?? fallback?.cover.code ?? "FO-01",
        url: row.cover_url,
        alt: row.cover_alt ?? `Portada de ${row.title}`,
        prompt: row.cover_prompt ?? undefined,
      },
      chapters,
    };
  });
}

export const getPublicStories = cache(async function getPublicStories() {
  const client = createPublicSupabaseClient();
  if (!client) return localStories;

  try {
    const databaseStories = await loadStories(client);

    // Supabase puede estar conectado antes de que se hayan importado las
    // historias nativas. Una base vacía nunca debe ocultar el contenido que ya
    // existe en el proyecto, especialmente los 20 capítulos de la estación.
    return databaseStories.length > 0 ? databaseStories : localStories;
  } catch (error) {
    console.error("No se pudieron cargar las historias desde Supabase.", error);
    return localStories;
  }
});

export async function getPublicStory(slug: string) {
  const stories = await getPublicStories();
  return stories.find((story) => story.slug === slug);
}

export const getAdminStories = cache(async function getAdminStories() {
  const client = await createServerSupabaseClient();
  if (!client) return localStories;

  const databaseStories = await loadStories(client);
  const databaseSlugs = new Set(databaseStories.map((story) => story.slug));

  return [
    ...databaseStories,
    ...localStories.filter((story) => !databaseSlugs.has(story.slug)),
  ];
});

export async function getAdminStory(slug: string) {
  const stories = await getAdminStories();
  return stories.find((story) => story.slug === slug);
}
