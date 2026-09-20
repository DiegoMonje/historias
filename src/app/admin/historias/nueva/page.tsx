import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StoryEditor } from "@/components/story-editor";

export default function NewStoryPage() {
  return (
    <div className="admin-page admin-page--editor">
      <header className="admin-page__header admin-page__header--editor">
        <div>
          <Link className="admin-back" href="/admin">
            <ArrowLeft size={16} /> Volver al panel
          </Link>
          <span className="admin-kicker">Nueva publicación</span>
          <h1>Crear una historia</h1>
          <p>Completa los datos, pega el texto y revisa los capítulos antes de publicar.</p>
        </div>
      </header>
      <StoryEditor />
    </div>
  );
}
