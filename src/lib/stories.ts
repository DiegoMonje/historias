import type { Chapter, Story } from "@/lib/types";
import {
  stationChapters,
  stationReadingMinutes,
} from "@/content/la-estacion-de-las-317";
import {
  lazarusChapters,
  lazarusReadingMinutes,
} from "@/content/proyecto-lazaro";

const sharedChapterTitles = [
  "La llamada",
  "Una puerta abierta",
  "El primer rastro",
  "Lo que nadie contó",
  "La línea roja",
  "Bajo vigilancia",
  "Un nombre en la pared",
  "La segunda llave",
  "Fuera de cobertura",
  "El testigo",
  "Punto de no retorno",
  "La habitación vacía",
  "El intercambio",
  "Antes del amanecer",
  "La verdad incompleta",
  "Los que regresan",
  "Última coordenada",
  "El precio del silencio",
  "La salida",
  "Después de todo",
];

function buildChapterParagraphs(
  storyTitle: string,
  chapterTitle: string,
  number: number,
  opening: string,
) {
  return [
    `${opening} El capítulo ${number} comenzó con una certeza incómoda: nada de lo descubierto hasta entonces había ocurrido por casualidad.`,
    `La pista conducía de nuevo al centro del misterio. Cada detalle de «${chapterTitle}» parecía preparado para obligarles a avanzar, incluso sabiendo que alguien observaba cada paso.`,
    "Durante unos segundos nadie habló. El silencio no era ausencia de ruido, sino una advertencia. Detrás de la puerta, algo metálico rozó el suelo y se detuvo.",
    "La decisión debía tomarse antes de que amaneciera. Volver significaba perder la única oportunidad; continuar podía revelar una verdad que quizá habría sido mejor no conocer.",
    `Cuando la señal desapareció, solo quedó una frase escrita en la pantalla: «La historia de ${storyTitle} todavía no ha terminado».`,
  ];
}

function makeChapters(
  storyTitle: string,
  opening: string,
  titles = sharedChapterTitles,
): Chapter[] {
  return titles.map((title, index) => ({
    number: index + 1,
    title,
    readingMinutes: index === 0 ? 7 : 6 + (index % 4),
    paragraphs: buildChapterParagraphs(storyTitle, title, index + 1, opening),
    visuals:
      index === 0
        ? [
            {
              id: `${storyTitle}-visual-1`,
              afterParagraph: 2,
              alt: `Escena principal del capítulo ${index + 1} de ${storyTitle}`,
              prompt: `Ilustración cinematográfica y realista para ${storyTitle}, capítulo ${index + 1}: ${title}`,
              aspectRatio: "16/9",
              status: "pending",
              url: null,
            },
          ]
        : [],
  }));
}

export const stories: Story[] = [
  {
    slug: "la-estacion-de-las-317",
    title: "La estación de las 3:17",
    eyebrow: "Un tren que no debería existir",
    tagline: "Hay destinos de los que nadie regresa igual.",
    synopsis:
      "Una empleada de estación recibe una llamada imposible minutos antes de que un tren desaparecido hace veintidós años vuelva a entrar en servicio. Entre sus pasajeros podría estar la hermana que perdió cuando era niña.",
    genres: ["Suspense", "Intriga"],
    status: "Completa",
    year: 2026,
    author: "Ficción Oculta",
    totalReadingMinutes: stationReadingMinutes,
    featured: true,
    cover: {
      variant: "signal",
      accent: "#f1b75a",
      ink: "#071319",
      code: "03:17",
    },
    chapters: stationChapters,
  },
  {
    slug: "proyecto-lazaro",
    title: "Proyecto Lázaro",
    eyebrow: "Nadie debía despertar",
    tagline: "La memoria también puede ser un arma.",
    synopsis:
      "Un agente dado por muerto despierta sin recuerdos en una instalación evacuada. Para salir deberá descubrir por qué todos los archivos llevan su firma.",
    genres: ["Acción", "Ciencia ficción"],
    status: "Completa",
    year: 2026,
    author: "Ficción Oculta",
    totalReadingMinutes: lazarusReadingMinutes,
    cover: {
      variant: "grid",
      accent: "#ff5f52",
      ink: "#160809",
      code: "LZ-04",
    },
    chapters: lazarusChapters,
  },
  {
    slug: "el-faro-sin-mapa",
    title: "El faro sin mapa",
    eyebrow: "La costa guarda una ruta secreta",
    tagline: "Toda luz proyecta una sombra.",
    synopsis:
      "Tres navegantes encuentran un faro que no aparece en las cartas marítimas. Su luz señala una isla distinta cada noche y una de ellas lleva directamente a 1936.",
    genres: ["Aventura", "Intriga"],
    status: "Completa",
    year: 2026,
    author: "Ficción Oculta",
    totalReadingMinutes: 154,
    cover: {
      variant: "horizon",
      accent: "#77c7bd",
      ink: "#061418",
      code: "N 36°",
    },
    chapters: makeChapters(
      "El faro sin mapa",
      "El mar estaba en calma cuando una luz blanca cortó la niebla por primera vez.",
    ),
  },
  {
    slug: "48-horas-bajo-tierra",
    title: "48 horas bajo tierra",
    eyebrow: "La salida se está cerrando",
    tagline: "No todos quieren ser rescatados.",
    synopsis:
      "Tras el derrumbe de una mina experimental, un equipo de rescate descubre una ciudad subterránea y una señal de auxilio emitida treinta años antes.",
    genres: ["Suspense", "Acción"],
    status: "Completa",
    year: 2026,
    author: "Ficción Oculta",
    totalReadingMinutes: 141,
    cover: {
      variant: "depth",
      accent: "#e98b4d",
      ink: "#110b08",
      code: "-840 M",
    },
    chapters: makeChapters(
      "48 horas bajo tierra",
      "La tierra volvió a temblar y el polvo borró la única señal que indicaba la salida.",
    ),
  },
  {
    slug: "la-ruta-de-los-desaparecidos",
    title: "La ruta de los desaparecidos",
    eyebrow: "Kilómetro 189",
    tagline: "La carretera recuerda a quienes se lleva.",
    synopsis:
      "Una periodista sigue las huellas de once vehículos desaparecidos en el mismo tramo de carretera. Todos fueron vistos por última vez a las 23:44.",
    genres: ["Intriga", "Suspense"],
    status: "En curso",
    year: 2026,
    author: "Ficción Oculta",
    totalReadingMinutes: 132,
    cover: {
      variant: "smoke",
      accent: "#b7d7dc",
      ink: "#081113",
      code: "KM 189",
    },
    chapters: makeChapters(
      "La ruta de los desaparecidos",
      "A las 23:44, la radio perdió la señal y la carretera dejó de aparecer en el navegador.",
    ),
  },
  {
    slug: "codigo-niebla",
    title: "Código Niebla",
    eyebrow: "Una ciudad sin comunicaciones",
    tagline: "El apagón solo era el principio.",
    synopsis:
      "Madrid queda aislada durante nueve minutos. Cuando vuelve la electricidad, cien personas han cambiado de identidad y nadie salvo una criptógrafa parece recordarlo.",
    genres: ["Acción", "Intriga"],
    status: "Próximamente",
    year: 2026,
    author: "Ficción Oculta",
    totalReadingMinutes: 145,
    cover: {
      variant: "eclipse",
      accent: "#8d7fff",
      ink: "#0a0714",
      code: "09:00",
    },
    chapters: makeChapters(
      "Código Niebla",
      "La pantalla se apagó exactamente nueve minutos después de recibir el mensaje cifrado.",
    ),
  },
];

export function getStory(slug: string) {
  return stories.find((story) => story.slug === slug);
}

export function getChapter(story: Story, chapterNumber: number) {
  return story.chapters.find((chapter) => chapter.number === chapterNumber);
}

export function getFeaturedStory() {
  return stories.find((story) => story.featured) ?? stories[0];
}
