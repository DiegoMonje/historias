import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { StoryEditForm } from "@/components/story-edit-form";
import { getAdminStory } from "@/lib/story-repository";

export const dynamic = "force-dynamic";

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getAdminStory(slug);

  if (!story) notFound();

  const editableStory = {
    ...story,
    chapters: story.chapters.map(({ number, title, readingMinutes }) => ({
      number,
      title,
      readingMinutes,
    })),
  };

  return (
    <div className="admin-page admin-page--editor">
      <header className="admin-page__header admin-page__header--editor">
        <div>
          <Link className="admin-back" href="/admin">
            <ArrowLeft size={15} /> Volver al panel
          </Link>
          <span className="admin-kicker">Editar historia</span>
          <h1>{story.title}</h1>
          <p>Los cambios publicados se reflejarán automáticamente en toda la web.</p>
        </div>
        <Link className="button button--ghost" href={`/historias/${story.slug}`} target="_blank">
          <ExternalLink size={16} /> Ver historia
        </Link>
      </header>
      <StoryEditForm story={editableStory} />
    </div>
  );
}
