import { toChineseNumber } from "./chinese-calendar.js";
import { text } from "./resources.js";

export const FivePhasesRelation = {
  Same: "Same",
  Generate: "Generate",
  OverCome: "OverCome",
};

export const InternalExternalRelation = {
  InternalGeneratesExternal: "InternalGeneratesExternal",
  InternalOvercomesExternal: "InternalOvercomesExternal",
  ExternalGeneratesInternal: "ExternalGeneratesInternal",
  ExternalOvercomessInternal: "ExternalOvercomessInternal",
  InternalExternalSame: "InternalExternalSame",
};

class FivePhasesAttribute {
  constructor(name) {
    this.name = name;
    this.next = null;
  }

  get generates() {
    return this.next;
  }

  get overcomes() {
    return this.next.next;
  }

  getRelation(another) {
    if (this === another) {
      return { start: this, end: another, relation: FivePhasesRelation.Same };
    }
    if (this.generates === another) {
      return { start: this, end: another, relation: FivePhasesRelation.Generate };
    }
    if (this.overcomes === another) {
      return { start: this, end: another, relation: FivePhasesRelation.OverCome };
    }
    if (another.generates === this) {
      return { start: another, end: this, relation: FivePhasesRelation.Generate };
    }
    return { start: another, end: this, relation: FivePhasesRelation.OverCome };
  }

  toString() {
    return this.name;
  }
}

export const fivePhases = {
  Water: new FivePhasesAttribute(text("main", "FivePhasesAttributeWater")),
  Metal: new FivePhasesAttribute(text("main", "FivePhasesAttributeGold")),
  Earth: new FivePhasesAttribute(text("main", "FivePhasesAttributeEarth")),
  Fire: new FivePhasesAttribute(text("main", "FivePhasesAttributeFire")),
  Wood: new FivePhasesAttribute(text("main", "FivePhasesAttributeWood")),
};

fivePhases.Metal.next = fivePhases.Water;
fivePhases.Earth.next = fivePhases.Metal;
fivePhases.Fire.next = fivePhases.Earth;
fivePhases.Wood.next = fivePhases.Fire;
fivePhases.Water.next = fivePhases.Wood;

const trigramNames = [
  "TrigramQian",
  "TrigramDui",
  "TrigramLi",
  "TrigramZhen",
  "TrigramXun",
  "TrigramKan",
  "TrigramGen",
  "TrigramKun",
].map((key) => text("main", key));

const trigramSymbols = [
  "TrigramSymbolHeaven",
  "TrigramSymbolLake",
  "FivePhasesAttributeFire",
  "TrigramSymbolThunder",
  "TrigramSymbolWind",
  "FivePhasesAttributeWater",
  "TrigramSymbolMountain",
  "TrigramSymbolEarth",
].map((key) => text("main", key));

const trigramLinePatterns = [
  [1, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
  [1, 0, 0],
  [0, 1, 1],
  [0, 1, 0],
  [0, 0, 1],
  [0, 0, 0],
];

const trigramPatternIds = new Map(
  trigramLinePatterns.map((pattern, index) => [pattern.join(""), index + 1]),
);

export const trigramImages = [
  { family: "父", direction: "西北", nature: "天", quality: "健" },
  { family: "少女", direction: "西", nature: "澤", quality: "悅" },
  { family: "中女", direction: "南", nature: "火", quality: "麗" },
  { family: "長男", direction: "東", nature: "雷", quality: "動" },
  { family: "長女", direction: "東南", nature: "風", quality: "入" },
  { family: "中男", direction: "北", nature: "水", quality: "陷" },
  { family: "少男", direction: "東北", nature: "山", quality: "止" },
  { family: "母", direction: "西南", nature: "地", quality: "順" },
];

const hexagramResourceKeys = [
  [
    "HexagramQian",
    "HexagramLv",
    "HexagramTongRen",
    "HexagramWuWang",
    "HexagramGou",
    "HexagramSong",
    "HexagramDun",
    "HexagramPi",
  ],
  [
    "HexagramGuai",
    "HexagramDui",
    "HexagramGe",
    "HexagramSui",
    "HexagramDaGuo",
    "HexagramKun",
    "HexagramXian",
    "HexagramCui",
  ],
  [
    "HexagramDaYou",
    "HexagramKui",
    "HexagramLi",
    "HexagramShiKe",
    "HexagramDing",
    "HexagramWeiJi",
    "HexagramLv_Travel",
    "HexagramJin",
  ],
  [
    "HexagramDaZhuang",
    "HexagramGuiMei",
    "HexagramFeng",
    "HexagramZhen",
    "HexagramHeng",
    "HexagramJie",
    "HexagramXiaoGuo",
    "HexagramYu",
  ],
  [
    "HexagramXiaoXu",
    "HexagramZhongFu",
    "HexagramJiaRen",
    "HexagramYi",
    "HexagramXun",
    "HexagramHuan",
    "HexagramJian",
    "HexagramGuan",
  ],
  [
    "HexagramXu",
    "HexagramJie_ShuiZe",
    "HexagramJiJi",
    "HexagramTun",
    "HexagramJing",
    "HexagramKan",
    "HexagramJian_ShuiShan",
    "HexagramBi",
  ],
  [
    "HexagramDaXu",
    "HexagramSun",
    "HexagramBi_ShanHuo",
    "HexagramYi_ShanLei",
    "HexagramGu",
    "HexagramMeng",
    "HexagramGen",
    "HexagramBo",
  ],
  [
    "HexagramTai",
    "HexagramLin",
    "HexagramMingYi",
    "HexagramFu",
    "HexagramSheng",
    "HexagramShi",
    "HexagramQian_DiShan",
    "HexagramKun_WeiDi",
  ],
];

export const hexagramNames = hexagramResourceKeys.map((row) =>
  row.map((key) => text("main", key)),
);

export function getAllHexagrams(changingIndex = 1) {
  return eightTrigrams.flatMap((upper) =>
    eightTrigrams.map((lower) => new Hexagram(upper, lower, changingIndex)),
  );
}

export class Trigram {
  constructor(id, attribute) {
    if (id < 1 || id > 8) throw new RangeError("guaId");
    this.id = id;
    this.attribute = attribute;
  }

  get name() {
    return trigramNames[this.id - 1];
  }

  get symbol() {
    return trigramSymbols[this.id - 1];
  }

  get lines() {
    return [...trigramLinePatterns[this.id - 1]];
  }

  get imageInfo() {
    return trigramImages[this.id - 1];
  }

  change(yaoForChange) {
    if (yaoForChange < 1 || yaoForChange > 3) {
      throw new RangeError("yaoForChange");
    }
    let i = this.id - 1;
    i ^= 7;
    const theXor = yaoForChange === 1 ? 4 : yaoForChange === 2 ? 2 : 1;
    const newI = (i ^ theXor) ^ 7;
    return eightTrigrams[newI];
  }

  toString() {
    return `${this.name}${text("main", "ChineseWordRepresent")}${this.symbol}`;
  }
}

export const eightTrigrams = [
  new Trigram(1, fivePhases.Metal),
  new Trigram(2, fivePhases.Metal),
  new Trigram(3, fivePhases.Fire),
  new Trigram(4, fivePhases.Wood),
  new Trigram(5, fivePhases.Wood),
  new Trigram(6, fivePhases.Water),
  new Trigram(7, fivePhases.Earth),
  new Trigram(8, fivePhases.Earth),
];

export function trigramFromLines(lines) {
  const id = trigramPatternIds.get(lines.join(""));
  if (!id) throw new Error(`Unknown trigram line pattern: ${lines.join("")}`);
  return eightTrigrams[id - 1];
}

export class Hexagram {
  constructor(upperTrigram, lowerTrigram, changingIndex) {
    this.upper = upperTrigram;
    this.lower = lowerTrigram;
    this.changingIndex = changingIndex;
  }

  get changingIndexName() {
    return toChineseNumber(this.changingIndex);
  }

  get externalTrigram() {
    return this.changingIndex > 3 ? this.upper : this.lower;
  }

  get internalTrigram() {
    return this.externalTrigram === this.upper ? this.lower : this.upper;
  }

  get name() {
    return hexagramNames[this.upper.id - 1][this.lower.id - 1];
  }

  get storeSequence() {
    return (this.upper.id - 1) * 8 + this.lower.id;
  }

  get symbolicNumber() {
    return this.upper.id + this.lower.id + this.changingIndex;
  }

  get lines() {
    return [...this.lower.lines, ...this.upper.lines];
  }

  get changesTo() {
    const d = this.changingIndex > 3 ? this.changingIndex - 3 : this.changingIndex;
    const newGua = this.externalTrigram.change(d);
    return new Hexagram(
      this.changingIndex > 3 ? newGua : this.upper,
      this.changingIndex > 3 ? this.lower : newGua,
      this.changingIndex,
    );
  }

  get mutualHexagram() {
    const lines = this.lines;
    return new Hexagram(
      trigramFromLines([lines[2], lines[3], lines[4]]),
      trigramFromLines([lines[1], lines[2], lines[3]]),
      this.changingIndex,
    );
  }

  get oppositeHexagram() {
    const lines = this.lines.map((line) => (line ? 0 : 1));
    return new Hexagram(
      trigramFromLines(lines.slice(3, 6)),
      trigramFromLines(lines.slice(0, 3)),
      this.changingIndex,
    );
  }

  get reversedHexagram() {
    const lines = [...this.lines].reverse();
    return new Hexagram(
      trigramFromLines(lines.slice(3, 6)),
      trigramFromLines(lines.slice(0, 3)),
      this.changingIndex,
    );
  }

  getInternalExternalRelation() {
    const tiYong = this.internalTrigram.attribute.getRelation(
      this.externalTrigram.attribute,
    );

    if (tiYong.relation === FivePhasesRelation.Generate) {
      if (tiYong.start === this.internalTrigram.attribute) {
        return InternalExternalRelation.InternalGeneratesExternal;
      }
      return InternalExternalRelation.ExternalGeneratesInternal;
    }

    if (tiYong.relation === FivePhasesRelation.OverCome) {
      if (tiYong.start === this.internalTrigram.attribute) {
        return InternalExternalRelation.InternalOvercomesExternal;
      }
      return InternalExternalRelation.ExternalOvercomessInternal;
    }

    return InternalExternalRelation.InternalExternalSame;
  }

  toString() {
    return `${this.name}(${this.upper.name}${text("main", "WordUp")}${this.lower.name}${text("main", "WordDown")}) ${this.changingIndexName}${text("main", "ChineseWordYao")}${text("main", "ChineseWordDong")}`;
  }
}
