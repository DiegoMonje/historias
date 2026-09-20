import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { ChapterEditForm } from "@/components/chapter-edit-form";
import { getAdminStory } from "@/lib/story-repository";

export const dynamic = "force-dynamic";

export default async function EditChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter: chapterParam } = await params;
  const story = await getAdminStory(slug);
  const chapterNumber = Number(chapterParam);
  const chapter = story?.chapters.find((item) => item.number === chapterNumber);

  if (!story || !chapter || !Number.isInteger(chapterNumber)) notFound();

  return (
    <div className="admin-page admin-page--editor">
      <header className="admin-page__header admin-page__header--editor">
        <div>
          <Link className="admin-back" href={`/admin/historias/${story.slug}`}>
            <ArrowLeft size={15} /> Volver a {story.title}
          </Link>
          <span className="admin-kicker">Capítulo {chapter.number}</span>
          <h1>{chapter.title}</h1>
          <p>Edita el título, el tiempo estimado y el texto completo del capítulo.</p>
        </div>
        <Link
          className="button button--ghost"
          href={`/historias/${story.slug}/capitulo/${chapter.number}`}
          target="_blank"
        >
          <ExternalLink size={16} /> Vista pública
        </Link>
      </header>
      <ChapterEditForm slug={story.slug} chapter={chapter} />
    </div>
  );
}
