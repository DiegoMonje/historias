import { createHash } from "node:crypto";

const OUTDATED_NATIVE_CHAPTER_HASHES: Record<string, string> = {
  "proyecto-lazaro:2": "5627f15ea7756ede721dfd252b9d03178be7c0cb59cb808387169ce02795819d",
  "proyecto-lazaro:3": "4aab753f16ce195ed85d9d7f99d1d365001184a29bf1373950b5b827c3b45401",
  "proyecto-lazaro:7": "b2edf4740e86290b61ce7f8b4ea1f726ed735d8a8107038a282d12feceb561f7",
  "proyecto-lazaro:9": "840a94200a57abdb04ddcfcc3476d39fd5fdd42e6769e19a237fb2e0db22b8be",
  "proyecto-lazaro:11": "9098aa7e62396a3572d349e79d131c04b231a5280c1526d9f457ee9b69b808cf",
  "proyecto-lazaro:12": "5a5a895941e68884a6a8539b426c6e990126461505ae9572a6ef0939d026b13d",
  "proyecto-lazaro:13": "b117e99430aafb3d2996b0c51aa7c6e73a66659d6161e003c82b9dcde59e9acd",
  "proyecto-lazaro:14": "b9f02f2927fe1c41c91e207ea6ebec7a9f7072948032c341e2778c64d9ae9c73",
  "proyecto-lazaro:15": "a3e9ca9ab78a104826edfae6e6f7fb36e2c3b19275b37e29279f71970bbebc57",
  "proyecto-lazaro:16": "9b937368134c0c601ced7a604a5b123b6871418fff8247dd22ea4c9ce1d315f6",
  "proyecto-lazaro:17": "7b364b10ae66c80c1fcad9ad1539d9abeaa8b183d05a65811c4a9c55ca4a744f",
  "proyecto-lazaro:18": "bb6b77f3f77f7654e4c9ccf451d46c367a8b9e60d94cd299733be2d9518b73d2",
  "proyecto-lazaro:19": "7a26bb4ea08fe2f645107298354b15cbc67db64e5066be6af74dfd39c05cdd5c",
  "proyecto-lazaro:20": "7b1dc73d8168758985c6edf78a1cf0da69a1d360b2dd50dba42657e882b3da04",
};

function nativeContentHash(content: unknown) {
  if (!Array.isArray(content) || content.some((paragraph) => typeof paragraph !== "string")) {
    return null;
  }

  return createHash("sha256").update(JSON.stringify(content)).digest("hex");
}

export function isKnownOutdatedNativeChapter(
  storySlug: string,
  chapterNumber: number,
  content: unknown,
) {
  const expectedHash = OUTDATED_NATIVE_CHAPTER_HASHES[`${storySlug}:${chapterNumber}`];
  return Boolean(expectedHash && nativeContentHash(content) === expectedHash);
}

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
