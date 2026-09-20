import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterReader } from "@/components/chapter-reader";
import { getChapter, getStory, stories } from "@/lib/stories";

export function generateStaticParams() {
  return stories.flatMap((story) =>
    story.chapters.map((chapter) => ({
      slug: story.slug,
      chapter: String(chapter.number),
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}): Promise<Metadata> {
  const { slug, chapter: chapterParam } = await params;
  const story = getStory(slug);
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
  const story = getStory(slug);
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
