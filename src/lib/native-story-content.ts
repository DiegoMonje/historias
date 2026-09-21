export function isGeneratedPlaceholderContent(
  storyTitle: string,
  content: unknown,
) {
  if (!Array.isArray(content)) return false;

  const paragraphs = content.filter(
    (paragraph): paragraph is string => typeof paragraph === "string",
  );

  return (
    paragraphs.length === 5 &&
    paragraphs.some((paragraph) =>
      paragraph.includes("comenzó con una certeza incómoda"),
    ) &&
    paragraphs.some((paragraph) =>
      paragraph.includes(`La historia de ${storyTitle} todavía no ha terminado`),
    )
  );
}
