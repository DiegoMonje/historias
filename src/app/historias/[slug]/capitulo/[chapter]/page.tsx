import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterReader } from "@/components/chapter-reader";
import { getChapter } from "@/lib/stories";
import { getPublicStory } from "@/lib/story-repository";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}): Promise<Metadata> {
  const { slug, chapter: chapterParam } = await params;
  const story = await getPublicStory(slug);
  const chapter = story ? getChapter(story, Number(chapterParam)) : undefined;

  if (!story || !chapter) return {};

  return {
    title: `${chapter.title} — Capítulo ${chapter.number}`,
    description: `Lee el capítulo ${chapter.number} de ${story.title}: ${chapter.title}.`,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter: chapterParam } = await params;
  const story = await getPublicStory(slug);
  const chapterNumber = Number(chapterParam);
  const chapter = story ? getChapter(story, chapterNumber) : undefined;

  if (!story || !chapter || !Number.isInteger(chapterNumber)) notFound();

  return (
    <ChapterReader
      storySlug={story.slug}
      storyTitle={story.title}
      totalChapters={story.chapters.length}
      chapter={chapter}
    />
  );
}
