export type StoryGenre =
  | "Suspense"
  | "Intriga"
  | "Aventura"
  | "Acción"
  | "Ciencia ficción";

export type StoryStatus = "Completa" | "En curso" | "Próximamente";

export type CoverVariant =
  | "signal"
  | "eclipse"
  | "depth"
  | "horizon"
  | "grid"
  | "smoke";

export interface ChapterVisual {
  id: string;
  afterParagraph: number;
  alt: string;
  prompt: string;
  aspectRatio: "16/9" | "3/2" | "4/3";
  status: "pending" | "published";
  url?: string | null;
}

export interface Chapter {
  number: number;
  title: string;
  readingMinutes: number;
  paragraphs: string[];
  visuals: ChapterVisual[];
}

export interface Story {
  slug: string;
  title: string;
  eyebrow: string;
  tagline: string;
  synopsis: string;
  genres: StoryGenre[];
  status: StoryStatus;
  year: number;
  author: string;
  totalReadingMinutes: number;
  featured?: boolean;
  cover: {
    variant: CoverVariant;
    accent: string;
    ink: string;
    code: string;
  };
  chapters: Chapter[];
}
