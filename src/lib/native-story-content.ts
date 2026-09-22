import { createHash } from "node:crypto";

const OUTDATED_NATIVE_CHAPTER_HASHES: Record<string, string> = {
  "la-estacion-de-las-317:3": "50ce3ee31f0c78fca0a3d62709190740f12b65eb813fe0a6b504af59c9bd724c",
  "la-estacion-de-las-317:4": "3c6ad7fe535e913b2c1efc79fc6c6cdbc8275c26b0a8661b8588bcf94fe4faf7",
  "la-estacion-de-las-317:5": "056388d870846de393f38c1c978a3913e1eaab6dff75024f16b4f5dc23ce2e82",
  "la-estacion-de-las-317:6": "eda2742eae80537b78dcbe373b21b9324fad3b21e16fd8a257008e29d1d260ad",
  "la-estacion-de-las-317:7": "c761d8dc05f82ea0f372bef0f202eabef2725d97fb1abc68675b6ebca51434f5",
  "la-estacion-de-las-317:10": "40582a79116b76e58e7723f7ae67fa98208e409eeccc9566467033d821df1521",
  "la-estacion-de-las-317:11": "4f78ff20679eb174b1348f3203ef0806671447a728bec3d039c595179f6dd0bf",
  "la-estacion-de-las-317:12": "30986d7f6cf6fc60b90fa61f1e5c52590747e78c2a0ab804799a50f7cc7ba593",
  "la-estacion-de-las-317:13": "7338cd12e6179ffaf56106d9319c08f4a8da1e77e10d40b2d26ec3e7ab78cd3c",
  "la-estacion-de-las-317:14": "33462e4792ecf92ed92d31ae3aeaf67a2e9adf82b83ba2aeff9b0d584b731f70",
  "la-estacion-de-las-317:15": "ea5bc89d2814395ab1b8ec6eba8f8c47bb5b440eb98b0a4985cbfa045c050f54",
  "la-estacion-de-las-317:17": "8b7c1fed4198eb354e66ffcea539afce965aef787fb0f13eb57afc7e43a8d1ec",
  "la-estacion-de-las-317:18": "08ae67671a8a3da7e607c0327d086fe931b96c0ee50e88235209072f721e0196",
  "la-estacion-de-las-317:19": "ee1e19258b9d8964b89273a5809b17401493ba01ce93d8b249a97176d19a5270",
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
