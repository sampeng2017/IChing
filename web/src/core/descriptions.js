import { text } from "./resources.js";
import { labels } from "./labels.js";
import { toChineseNumber } from "./chinese-calendar.js";

const key = (hexagram, suffix) => `H_${hexagram.storeSequence}_${suffix}`;

const relationGuidance = {
  InternalGeneratesExternal: {
    label: "體生用",
    meaning: "體卦生用卦，主我方之氣外泄，事情可推動但較耗心力。",
    categories: "求財宜保守，感情宜多付出但防失衡，疾病宜調養元氣，失物多需主動尋訪。",
  },
  InternalOvercomesExternal: {
    label: "體克用",
    meaning: "體卦克用卦，主我能制事，所問之事可掌控，但過剛則易生阻力。",
    categories: "求財可爭取但忌躁進，感情宜放緩控制欲，訴訟競爭可據理而行。",
  },
  ExternalGeneratesInternal: {
    label: "用生體",
    meaning: "用卦生體卦，主外事助我，所問多有扶持與轉機。",
    categories: "求財、感情、合作多較順；疾病得助可復；失物有望由外緣得線索。",
  },
  ExternalOvercomessInternal: {
    label: "用克體",
    meaning: "用卦克體卦，主外事壓我，阻力較重，宜先避其鋒。",
    categories: "求財防耗損，感情防衝突，疾病宜早治，訴訟競爭不宜冒進。",
  },
  InternalExternalSame: {
    label: "體用比和",
    meaning: "體卦與用卦五行相同，主氣勢相和，事情平穩，可順勢而為。",
    categories: "求財重穩定，感情宜和合溝通，失物可循原處或熟悉路線尋找。",
  },
};

function formatTrigramProfile(label, trigram) {
  const info = trigram.imageInfo;
  return `${label}: ${trigram.name}（${info.nature}，五行${trigram.attribute}，${info.family}，${info.direction}，德性${info.quality}）`;
}

function formatLineDiagram(hexagram) {
  return hexagram.lines
    .map((line, index) => {
      const lineNumber = index + 1;
      const glyph = line ? "━━━━━━" : "━━  ━━";
      const yinYang = line ? "陽" : "陰";
      const moving = lineNumber === hexagram.changingIndex ? "（動）" : "";
      return `${toChineseNumber(lineNumber)}爻 ${glyph} ${yinYang}${moving}`;
    })
    .reverse()
    .join("\n");
}

export function getImageUrl(hexagram) {
  return `/images/h${hexagram.storeSequence}.png`;
}

export function getMainDesc(hexagram) {
  return text("iching", key(hexagram, "Main"));
}

export function getChangeDesc(hexagram) {
  return text("iching", key(hexagram, `Change${hexagram.changingIndex}`));
}

export function getSymbolDesc(hexagram) {
  return [
    text("iching", key(hexagram, "Meaning")),
    text("iching", key(hexagram, "Omen")),
  ].join("\n\n");
}

export function getPoemsDesc(hexagram) {
  return [
    text("iching", key(hexagram, "Poem1")),
    text("iching", key(hexagram, "Poem2")),
  ].filter(Boolean).join("\n\n");
}

export function getJudgementDesc(hexagram) {
  return [
    text("iching", key(hexagram, "Deduction")),
    text("iching", key(hexagram, "Judgement")),
  ].join("\n\n");
}

export function getJudgementClassifiedDesc(hexagram) {
  return ["Luck", "Health", "Love", "Lawsuit", "Lost"]
    .map((suffix) => text("iching", key(hexagram, suffix)))
    .join("\n\n");
}

export function getMeiHuaYiShu(hexagram) {
  const firstRelation = hexagram.getInternalExternalRelation();
  const secondRelation = hexagram.changesTo.getInternalExternalRelation();
  const firstGuidance = relationGuidance[firstRelation];
  const secondGuidance = relationGuidance[secondRelation];

  return [
    `本卦: ${hexagram.name}`,
    `之卦: ${hexagram.changesTo.name}`,
    `動爻: ${hexagram.changingIndexName}${text("main", "ChineseWordYao")}${text("main", "ChineseWordDong")}`,
    `體卦: ${hexagram.internalTrigram.name}（五行${hexagram.internalTrigram.attribute}）`,
    `用卦: ${hexagram.externalTrigram.name}（五行${hexagram.externalTrigram.attribute}）`,
    `體用: ${text("main", firstRelation)} -> ${text("main", secondRelation)}`,
    `${labels.hexagramSymbolNumber}: ${hexagram.symbolicNumber}`,
    "",
    `本卦判讀: ${firstGuidance.label}。${firstGuidance.meaning}`,
    `分類提示: ${firstGuidance.categories}`,
    "",
    `變卦趨勢: ${secondGuidance.label}。${secondGuidance.meaning}`,
  ].join("\n");
}

export function getStructureDesc(hexagram) {
  return [
    `本卦: ${hexagram.name}`,
    `之卦: ${hexagram.changesTo.name}`,
    `互卦: ${hexagram.mutualHexagram.name}`,
    `錯卦: ${hexagram.oppositeHexagram.name}`,
    `綜卦: ${hexagram.reversedHexagram.name}`,
    "",
    formatTrigramProfile("上卦", hexagram.upper),
    formatTrigramProfile("下卦", hexagram.lower),
    formatTrigramProfile("體卦", hexagram.internalTrigram),
    formatTrigramProfile("用卦", hexagram.externalTrigram),
    "",
    "六爻:",
    formatLineDiagram(hexagram),
  ].join("\n");
}

export function getTabContent(hexagram, activeTab) {
  if (activeTab === "main") {
    return `${getMainDesc(hexagram)}\n\n${getChangeDesc(hexagram)}`;
  }
  if (activeTab === "symbols") return getSymbolDesc(hexagram);
  if (activeTab === "poems") return getPoemsDesc(hexagram);
  if (activeTab === "judge") return getJudgementDesc(hexagram);
  if (activeTab === "classified") return getJudgementClassifiedDesc(hexagram);
  if (activeTab === "structure") return getStructureDesc(hexagram);
  return getMeiHuaYiShu(hexagram);
}
