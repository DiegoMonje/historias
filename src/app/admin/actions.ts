"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActionState } from "@/lib/action-state";
import { requireAdmin } from "@/lib/auth";
import {
  isGeneratedPlaceholderContent,
  isKnownOutdatedNativeChapter,
} from "@/lib/native-story-content";
import { stories as nativeStories } from "@/lib/stories";
import { toDatabaseStatus } from "@/lib/story-repository";
import type { Story, StoryGenre, StoryStatus } from "@/lib/types";

const coverTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const maximumCoverSize = 5 * 1024 * 1024;
const allowedGenres: StoryGenre[] = [
  "Suspense",
  "Intriga",
  "Aventura",
  "Acción",
  "Ciencia ficción",
];
const allowedStatuses: StoryStatus[] = ["Borrador", "En curso", "Próximamente", "Completa"];

function publishedAtFor(status: StoryStatus) {
  return status === "Borrador" ? null : new Date().toISOString();
}

function storyRow(story: Story) {
  return {
    slug: story.slug,
    title: story.title,
    eyebrow: story.eyebrow,
    tagline: story.tagline,
    synopsis: story.synopsis,
    author: story.author,
    status: toDatabaseStatus(story.status),
    year: story.year,
    cover_url: story.cover.url ?? null,
    cover_prompt: story.cover.prompt ?? null,
    cover_alt: story.cover.alt ?? `Portada de ${story.title}`,
    cover_variant: story.cover.variant,
    cover_accent: story.cover.accent,
    cover_ink: story.cover.ink,
    cover_code: story.cover.code,
    total_reading_minutes: story.totalReadingMinutes,
    featured: story.featured ?? false,
    published_at: publishedAtFor(story.status),
  };
}

async function syncGenres(
  supabase: SupabaseClient,
  storyId: string,
  genres: StoryGenre[],
) {
  const { data: genreRows, error: genreError } = await supabase
    .from("genres")
    .select("id, name")
    .in("name", genres);

  if (genreError) throw genreError;

  const { error: deleteError } = await supabase
    .from("story_genres")
    .delete()
    .eq("story_id", storyId);

  if (deleteError) throw deleteError;

  if (genreRows && genreRows.length > 0) {
    const { error: insertError } = await supabase.from("story_genres").insert(
      genreRows.map((genre) => ({
        story_id: storyId,
        genre_id: genre.id,
      })),
    );

    if (insertError) throw insertError;
  }
}

async function importNativeStories(supabase: SupabaseClient) {
  const { data: existingRows, error: existingError } = await supabase
    .from("stories")
    .select("id, slug")
    .in(
      "slug",
      nativeStories.map((story) => story.slug),
    );

  if (existingError) throw existingError;
  const idsBySlug = new Map((existingRows ?? []).map((row) => [row.slug, row.id]));

  for (const story of nativeStories) {
    let storyId = idsBySlug.get(story.slug) as string | undefined;
    let isNewStory = false;

    if (!storyId) {
      const { data: insertedStory, error: storyError } = await supabase
        .from("stories")
        .insert(storyRow(story))
        .select("id")
        .single();

      if (storyError) throw storyError;
      storyId = insertedStory.id;
      isNewStory = true;
    }

    if (!storyId) throw new Error(`No se pudo preparar ${story.slug}.`);

    if (isNewStory) {
      await syncGenres(supabase, storyId, story.genres);
    }

    const { data: existingChapters, error: chapterLookupError } = await supabase
      .from("chapters")
      .select("id, number, content")
      .eq("story_id", storyId);

    if (chapterLookupError) throw chapterLookupError;
    const existingByNumber = new Map(
      (existingChapters ?? []).map((chapter) => [chapter.number, chapter]),
    );
    let refreshedNativeContent = false;

    for (const chapter of story.chapters) {
      const existingChapter = existingByNumber.get(chapter.number);

      if (existingChapter) {
        const isPlaceholder = isGeneratedPlaceholderContent(
          story.title,
          existingChapter.content,
        );
        const isOutdatedNativeChapter = isKnownOutdatedNativeChapter(
          story.slug,
          chapter.number,
          existingChapter.content,
        );

        if (!isPlaceholder && !isOutdatedNativeChapter) {
          continue;
        }

        const { error: updateChapterError } = await supabase
          .from("chapters")
          .update({
            title: chapter.title,
            content: chapter.paragraphs,
            reading_minutes: chapter.readingMinutes,
            status: toDatabaseStatus(story.status),
            published_at: publishedAtFor(story.status),
          })
          .eq("id", existingChapter.id);

        if (updateChapterError) throw updateChapterError;

        if (isPlaceholder) {
          const { error: deleteMediaError } = await supabase
            .from("chapter_media")
            .delete()
            .eq("chapter_id", existingChapter.id);

          if (deleteMediaError) throw deleteMediaError;

          if (chapter.visuals.length > 0) {
            const { error: mediaError } = await supabase.from("chapter_media").insert(
              chapter.visuals.map((visual, index) => ({
                chapter_id: existingChapter.id,
                sort_order: index,
                after_block: visual.afterParagraph,
                image_url: visual.url ?? null,
                alt_text: visual.alt,
                generation_prompt: visual.prompt,
                aspect_ratio: visual.aspectRatio,
                status: visual.status,
              })),
            );

            if (mediaError) throw mediaError;
          }
        }

        refreshedNativeContent = true;
        continue;
      }

      const { data: insertedChapter, error: chapterError } = await supabase
        .from("chapters")
        .insert({
          story_id: storyId,
          number: chapter.number,
          title: chapter.title,
          content: chapter.paragraphs,
          reading_minutes: chapter.readingMinutes,
          status: toDatabaseStatus(story.status),
          published_at: publishedAtFor(story.status),
        })
        .select("id")
        .single();

      if (chapterError) throw chapterError;

      if (chapter.visuals.length > 0) {
        const { error: mediaError } = await supabase.from("chapter_media").insert(
          chapter.visuals.map((visual, index) => ({
            chapter_id: insertedChapter.id,
            sort_order: index,
            after_block: visual.afterParagraph,
            image_url: visual.url ?? null,
            alt_text: visual.alt,
            generation_prompt: visual.prompt,
            aspect_ratio: visual.aspectRatio,
            status: visual.status,
          })),
        );

        if (mediaError) throw mediaError;
      }
    }

    if (refreshedNativeContent) {
      const { error: storyUpdateError } = await supabase
        .from("stories")
        .update({
          status: toDatabaseStatus(story.status),
          total_reading_minutes: story.totalReadingMinutes,
          published_at: publishedAtFor(story.status),
        })
        .eq("id", storyId);

      if (storyUpdateError) throw storyUpdateError;
    }
  }
}

export async function importNativeStoriesAction(
  _previousState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  void _previousState;
  void _formData;

  try {
    const { supabase } = await requireAdmin();
    await importNativeStories(supabase);
    revalidatePath("/", "layout");
    return {
      status: "success",
      message: "Las historias nativas y sus capítulos ya están sincronizados con el CMS.",
    };
  } catch (error) {
    console.error("Error al importar las historias nativas.", error);
    return {
      status: "error",
      message: "No se pudo completar la importación. Comprueba el esquema de Supabase.",
    };
  }
}

async function getEditableStory(supabase: SupabaseClient, slug: string) {
  let result = await supabase
    .from("stories")
    .select("id, slug, cover_url")
    .eq("slug", slug)
    .maybeSingle();

  if (!result.data && nativeStories.some((story) => story.slug === slug)) {
    await importNativeStories(supabase);
    result = await supabase
      .from("stories")
      .select("id, slug, cover_url")
      .eq("slug", slug)
      .maybeSingle();
  }

  if (result.error) throw result.error;
  if (!result.data) throw new Error("Historia no encontrada.");
  return result.data;
}

function storagePathFromPublicUrl(url: string | null, storyId: string) {
  if (!url) return null;

  try {
    const pathname = new URL(url).pathname;
    const marker = "/storage/v1/object/public/story-media/";
    const markerIndex = pathname.indexOf(marker);
    if (markerIndex === -1) return null;

    const path = decodeURIComponent(pathname.slice(markerIndex + marker.length));
    return path.startsWith(`story-covers/${storyId}/`) ? path : null;
  } catch {
    return null;
  }
}

async function uploadCover(supabase: SupabaseClient, storyId: string, file: File) {
  const extension = coverTypes.get(file.type);

  if (!extension) {
    throw new Error("La portada debe ser JPG, PNG o WebP.");
  }

  if (file.size > maximumCoverSize) {
    throw new Error("La portada no puede superar los 5 MB.");
  }

  const path = `story-covers/${storyId}/${Date.now()}-${randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("story-media").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("story-media").getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function updateStoryAction(
  slug: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  void _previousState;

  try {
    const title = String(formData.get("title") ?? "").trim();
    const eyebrow = String(formData.get("eyebrow") ?? "").trim();
    const tagline = String(formData.get("tagline") ?? "").trim();
    const synopsis = String(formData.get("synopsis") ?? "").trim();
    const coverAlt = String(formData.get("coverAlt") ?? "").trim();
    const status = String(formData.get("status") ?? "") as StoryStatus;
    const genres = formData
      .getAll("genres")
      .map(String)
      .filter((genre): genre is StoryGenre => allowedGenres.includes(genre as StoryGenre));
    const featured = formData.get("featured") === "on";
    const cover = formData.get("cover");

    if (title.length < 2 || synopsis.length < 20) {
      return {
        status: "error",
        message: "Completa el título y escribe una sinopsis de al menos 20 caracteres.",
      };
    }
    if (!allowedStatuses.includes(status)) {
      return { status: "error", message: "Selecciona un estado válido." };
    }
    if (genres.length === 0) {
      return { status: "error", message: "Selecciona al menos un género." };
    }

    const { supabase } = await requireAdmin();
    const story = await getEditableStory(supabase, slug);
    let uploaded: { path: string; publicUrl: string } | null = null;

    if (cover instanceof File && cover.size > 0) {
      uploaded = await uploadCover(supabase, story.id, cover);
    }

    if (featured) {
      const { error: featuredError } = await supabase
        .from("stories")
        .update({ featured: false })
        .neq("id", story.id);
      if (featuredError) throw featuredError;
    }

    const { error: updateError } = await supabase
      .from("stories")
      .update({
        title,
        eyebrow,
        tagline,
        synopsis,
        status: toDatabaseStatus(status),
        featured,
        cover_alt: coverAlt || `Portada de ${title}`,
        ...(uploaded ? { cover_url: uploaded.publicUrl } : {}),
        published_at: publishedAtFor(status),
      })
      .eq("id", story.id);

    if (updateError) {
      if (uploaded) await supabase.storage.from("story-media").remove([uploaded.path]);
      throw updateError;
    }

    await syncGenres(supabase, story.id, genres);

    if (uploaded) {
      const oldPath = storagePathFromPublicUrl(story.cover_url, story.id);
      if (oldPath) await supabase.storage.from("story-media").remove([oldPath]);
    }

    revalidatePath("/", "layout");
    return {
      status: "success",
      message: uploaded
        ? "Historia y nueva portada guardadas correctamente."
        : "Historia guardada correctamente.",
    };
  } catch (error) {
    console.error("Error al guardar la historia.", error);
    return {
      status: "error",
      message:
        error instanceof Error && error.message.includes("portada")
          ? error.message
          : "No se pudieron guardar los cambios. Revisa la conexión con Supabase.",
    };
  }
}

export async function deleteCoverAction(
  slug: string,
  _previousState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  void _previousState;
  void _formData;

  try {
    const { supabase } = await requireAdmin();
    const story = await getEditableStory(supabase, slug);

    if (!story.cover_url) {
      return { status: "success", message: "La historia ya usa la portada gráfica de respaldo." };
    }

    const { error } = await supabase
      .from("stories")
      .update({ cover_url: null })
      .eq("id", story.id);
    if (error) throw error;

    const path = storagePathFromPublicUrl(story.cover_url, story.id);
    if (path) {
      const { error: removeError } = await supabase.storage.from("story-media").remove([path]);
      if (removeError) console.error("La portada quedó como archivo huérfano.", removeError);
    }

    revalidatePath("/", "layout");
    return {
      status: "success",
      message: "Portada eliminada. Se vuelve a mostrar el diseño gráfico de respaldo.",
    };
  } catch (error) {
    console.error("Error al eliminar la portada.", error);
    return { status: "error", message: "No se pudo eliminar la portada." };
  }
}

export async function updateChapterAction(
  slug: string,
  chapterNumber: number,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const readingMinutes = Number(formData.get("readingMinutes"));
    const paragraphs = content.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);

    if (!title || paragraphs.length === 0) {
      return { status: "error", message: "El capítulo necesita título y contenido." };
    }
    if (!Number.isInteger(readingMinutes) || readingMinutes < 1 || readingMinutes > 120) {
      return { status: "error", message: "El tiempo de lectura debe estar entre 1 y 120 minutos." };
    }

    const { supabase } = await requireAdmin();
    const story = await getEditableStory(supabase, slug);
    const { error } = await supabase
      .from("chapters")
      .update({ title, content: paragraphs, reading_minutes: readingMinutes })
      .eq("story_id", story.id)
      .eq("number", chapterNumber);

    if (error) throw error;

    revalidatePath(`/historias/${slug}`, "layout");
    revalidatePath(`/admin/historias/${slug}`, "layout");
    return { status: "success", message: "Capítulo guardado correctamente." };
  } catch (error) {
    console.error("Error al guardar el capítulo.", error);
    return { status: "error", message: "No se pudo guardar el capítulo." };
  }
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function parseImportedChapters(text: string) {
  return text
    .split(/(?=^\s*cap[ií]tulo\s+\d+)/gim)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk, index) => {
      const [heading, ...bodyLines] = chunk.split("\n");
      const paragraphs = bodyLines.join("\n").split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
      const words = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
      return {
        number: index + 1,
        title:
          heading.replace(/^\s*cap[ií]tulo\s+\d+\s*[:.-]?\s*/i, "").trim() ||
          `Capítulo ${index + 1}`,
        paragraphs,
        readingMinutes: Math.max(1, Math.ceil(words / 220)),
      };
    });
}

export async function createStoryAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let destination = "";

  try {
    const title = String(formData.get("title") ?? "").trim();
    const synopsis = String(formData.get("synopsis") ?? "").trim();
    const tagline = String(formData.get("tagline") ?? "").trim();
    const eyebrow = String(formData.get("eyebrow") ?? "").trim();
    const bulkText = String(formData.get("bulkText") ?? "").trim();
    const status = String(formData.get("status") ?? "Borrador") as StoryStatus;
    const genre = String(formData.get("genre") ?? "Suspense") as StoryGenre;
    const slug = slugify(title);
    const chapters = parseImportedChapters(bulkText);

    if (!title || synopsis.length < 20 || !slug) {
      return { status: "error", message: "Completa el título y una sinopsis de al menos 20 caracteres." };
    }
    if (!allowedGenres.includes(genre) || !allowedStatuses.includes(status)) {
      return { status: "error", message: "El género o el estado no son válidos." };
    }

    const { supabase } = await requireAdmin();
    const { data: created, error } = await supabase
      .from("stories")
      .insert({
        slug,
        title,
        eyebrow,
        tagline,
        synopsis,
        author: "Ficción Oculta",
        status: toDatabaseStatus(status),
        year: new Date().getFullYear(),
        cover_alt: `Portada de ${title}`,
        cover_variant: "signal",
        cover_accent: "#f1b75a",
        cover_ink: "#071319",
        cover_code: `FO-${String(Date.now()).slice(-2)}`,
        total_reading_minutes: chapters.reduce((sum, chapter) => sum + chapter.readingMinutes, 0),
        featured: false,
        published_at: publishedAtFor(status),
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        return { status: "error", message: "Ya existe una historia con ese título o dirección." };
      }
      throw error;
    }

    await syncGenres(supabase, created.id, [genre]);

    if (chapters.length > 0) {
      const { error: chapterError } = await supabase.from("chapters").insert(
        chapters.map((chapter) => ({
          story_id: created.id,
          number: chapter.number,
          title: chapter.title,
          content: chapter.paragraphs,
          reading_minutes: chapter.readingMinutes,
          status: toDatabaseStatus(status),
          published_at: publishedAtFor(status),
        })),
      );
      if (chapterError) throw chapterError;
    }

    revalidatePath("/", "layout");
    destination = `/admin/historias/${slug}`;
  } catch (error) {
    console.error("Error al crear la historia.", error);
    return { status: "error", message: "No se pudo crear la historia en Supabase." };
  }

  redirect(destination);
}
