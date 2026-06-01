import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");

function decodeXml(value) {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&")
    .replace(/\r\n/g, "\n");
}

async function convertResx(source, target) {
  const xml = await readFile(source, "utf8");
  const result = {};
  const entryPattern =
    /<data\s+name="([^"]+)"[^>]*>\s*<value>([\s\S]*?)<\/value>[\s\S]*?<\/data>/g;

  for (const match of xml.matchAll(entryPattern)) {
    result[match[1]] = decodeXml(match[2]);
  }

  if (!process.argv.includes("--check")) {
    await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  }

  return result;
}

function assertKeys(data, groupName, keys) {
  const missing = keys.filter((key) => typeof data[key] !== "string");
  if (missing.length > 0) {
    throw new Error(`${groupName} is missing required keys: ${missing.join(", ")}`);
  }
}

function validateResources(main, iching) {
  assertKeys(main, "Main.resx", [
    "MainPageTitle",
    "DivineNow",
    "DivineRandom",
    "ChineseAbout",
    "MainHelp",
    "HexgramMain",
    "HexgramSymbol",
    "HexgramPoem",
    "HexgramJudgement",
    "HexgramJudgeClassfied",
    "HexGramMeihua",
    "HexgramSymbolNumber",
    "ChineseChange",
    "ChineseWordDong",
    "ChineseWordYao",
    "WordUp",
    "WordDown",
  ]);

  for (let i = 1; i <= 64; i += 1) {
    assertKeys(
      iching,
      "IChing.Resx",
      [
        "Main",
        "Meaning",
        "Judgement",
        "Poem1",
        "Deduction",
        "Omen",
        "Luck",
        "Love",
        "Health",
        "Lost",
        "Lawsuit",
        "Poem2",
      ].map((suffix) => `H_${i}_${suffix}`),
    );

    assertKeys(
      iching,
      "IChing.Resx",
      Array.from({ length: 6 }, (_, index) => `H_${i}_Change${index + 1}`),
    );
  }
}

const main = await convertResx(
  resolve(root, "IChing", "Resources", "Main.resx"),
  resolve(here, "..", "src", "data", "main.zh-Hant.json"),
);
const iching = await convertResx(
  resolve(root, "IChing", "Resources", "IChing.Resx"),
  resolve(here, "..", "src", "data", "iching.zh-Hant.json"),
);

validateResources(main, iching);
console.log("Resource data validated.");
