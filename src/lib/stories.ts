import type { Chapter, Story } from "@/lib/types";

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

const stationTitles = [
  "El último tren",
  "Andén cero",
  "El hombre del abrigo gris",
  "Una voz en la megafonía",
  "El reloj detenido",
  "Billete de ida",
  "La taquilla número trece",
  "Nadie recuerda a Vera",
  "El túnel clausurado",
  "Las luces del norte",
  "Un pasajero menos",
  "La ciudad bajo las vías",
  "El mapa de ceniza",
  "Tres minutos de oscuridad",
  "La mujer que esperaba",
  "El maquinista",
  "La estación despierta",
  "La hora imposible",
  "El tren de las 3:17",
  "Donde terminan las vías",
];

const firstChapter = [
  "A las tres y diecisiete de la madrugada, el panel de llegadas de la estación de Santa Lucía encendió una línea que llevaba veintidós años apagada. Vera Salvatierra estaba sola en el vestíbulo cuando las letras rojas comenzaron a formar un destino que no figuraba en ningún mapa.",
  "No debía estar allí. Su turno había terminado cuarenta minutos antes, pero una llamada sin número la había retenido en la oficina de objetos perdidos. Al otro lado de la línea, una voz de mujer había pronunciado su nombre y una única frase: «Si el tren aparece, no dejes que abra las puertas».",
  "Vera pensó en una broma hasta que escuchó el silbido. Llegó desde el túnel norte, el tramo cerrado desde el incendio de 2004. Primero fue un hilo de aire; después, un temblor que hizo vibrar los cristales de las taquillas.",
  "En el panel, la nueva línea parpadeó una vez. TREN 317. PROCEDENCIA DESCONOCIDA. ANDÉN 0. No existía ningún andén cero, al menos no en los planos actuales.",
  "Las luces del vestíbulo se apagaron por filas. Vera tomó la linterna de emergencia y corrió hacia el puesto de seguridad, pero las pantallas ya no mostraban las cámaras de la estación. En todas aparecía la misma imagen: un andén antiguo, cubierto de niebla, y una niña de espaldas junto al borde.",
  "La niña se volvió lentamente hacia la cámara. Vera dejó caer la linterna. Llevaba el mismo abrigo amarillo que su hermana Lucía la noche en que desapareció.",
];

function buildChapterParagraphs(
  storyTitle: string,
  chapterTitle: string,
  number: number,
  opening: string,
) {
  if (storyTitle === "La estación de las 3:17" && number === 1) {
    return firstChapter;
  }

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
    author: "Historias",
    totalReadingMinutes: 148,
    featured: true,
    cover: {
      variant: "signal",
      accent: "#f1b75a",
      ink: "#071319",
      code: "03:17",
    },
    chapters: makeChapters(
      "La estación de las 3:17",
      "La estación permanecía vacía, pero el eco de unos pasos avanzaba por el andén.",
      stationTitles,
    ),
  },
  {
    slug: "proyecto-lazaro",
    title: "Proyecto Lázaro",
    eyebrow: "Nadie debía despertar",
    tagline: "La memoria también puede ser un arma.",
    synopsis:
      "Un agente dado por muerto despierta sin recuerdos en una instalación evacuada. Para salir deberá descubrir por qué todos los archivos llevan su firma.",
    genres: ["Acción", "Ciencia ficción"],
    status: "En curso",
    year: 2026,
    author: "Historias",
    totalReadingMinutes: 136,
    cover: {
      variant: "grid",
      accent: "#ff5f52",
      ink: "#160809",
      code: "LZ-04",
    },
    chapters: makeChapters(
      "Proyecto Lázaro",
      "Las alarmas llevaban horas sonando cuando Elías abrió los ojos dentro de la cámara.",
    ),
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
    author: "Historias",
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
    author: "Historias",
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
    author: "Historias",
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
    author: "Historias",
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
