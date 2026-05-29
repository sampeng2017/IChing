import assert from "node:assert/strict";
import test from "node:test";
import {
  ChineseCalendarDate,
  getChineseTwoHourPeriod,
  supportedDateRangeText,
} from "./chinese-calendar.js";
import { eightTrigrams, getAllHexagrams, Hexagram } from "./bagua.js";
import { divine, divineByTime } from "./divination.js";
import { getMainDesc, getStructureDesc, getTabContent } from "./descriptions.js";
import { labels } from "./labels.js";
import { resources, text } from "./resources.js";

test("Chinese two-hour period follows the original Windows Phone logic", () => {
  assert.equal(getChineseTwoHourPeriod(new Date(2024, 0, 1, 22, 59)), 12);
  assert.equal(getChineseTwoHourPeriod(new Date(2024, 0, 1, 23, 0)), 1);
  assert.equal(getChineseTwoHourPeriod(new Date(2024, 0, 1, 0, 0)), 1);
  assert.equal(getChineseTwoHourPeriod(new Date(2024, 0, 1, 1, 0)), 2);
});

test("Chinese date conversion keeps the 1900 base date behavior", () => {
  const date = new ChineseCalendarDate(new Date(1900, 0, 31, 12, 0));
  assert.equal(date.year, 1900);
  assert.equal(date.month, 1);
  assert.equal(date.day, 1);
  assert.equal(date.toString(), "庚子(鼠)年一月一日午時");
});

test("Chinese date conversion rejects dates outside the library range", () => {
  assert.equal(supportedDateRangeText(), "1900-01-31 to 2100-12-31");
  assert.throws(
    () => new ChineseCalendarDate(new Date(1900, 0, 30, 22, 59)),
    /supports Gregorian dates/,
  );
  assert.doesNotThrow(() => new ChineseCalendarDate(new Date(1900, 0, 30, 23, 0)));
  assert.doesNotThrow(() => new ChineseCalendarDate(new Date(2100, 11, 31, 22, 59)));
  assert.throws(
    () => new ChineseCalendarDate(new Date(2100, 11, 31, 23, 0)),
    /supports Gregorian dates/,
  );
});

test("Chinese date conversion fixes known old table mismatches", () => {
  const firstBugDate = new ChineseCalendarDate(new Date(1954, 10, 25, 12, 0));
  assert.equal(firstBugDate.year, 1954);
  assert.equal(firstBugDate.month, 11);
  assert.equal(firstBugDate.day, 1);
  assert.equal(firstBugDate.isLeapMonth, false);

  const leap2033 = new ChineseCalendarDate(new Date(2033, 11, 22, 12, 0));
  assert.equal(leap2033.year, 2033);
  assert.equal(leap2033.month, 11);
  assert.equal(leap2033.day, 1);
  assert.equal(leap2033.isLeapMonth, true);
});

test("time divination is deterministic for fixed timestamps", () => {
  const hexagram = divineByTime(new Date(2024, 1, 10, 0, 0));
  assert.equal(hexagram.name, "山地剝");
  assert.equal(hexagram.storeSequence, 56);
  assert.equal(hexagram.changingIndex, 2);
});

test("time divination follows Mei Hua year month day hour arithmetic", () => {
  const hexagram = divineByTime(new Date(2024, 1, 10, 0, 0));
  assert.equal(hexagram.upper.name, "艮");
  assert.equal(hexagram.lower.name, "坤");
  assert.equal(hexagram.changingIndex, 2);
  assert.equal(hexagram.internalTrigram.name, "艮");
  assert.equal(hexagram.externalTrigram.name, "坤");
  assert.equal(hexagram.changesTo.name, "山水蒙");
});

test("random divination accepts injectable random values and stays in range", () => {
  const values = [0, 7, 5];
  const hexagram = divine(() => values.shift());
  assert.equal(hexagram.upper.id, 1);
  assert.equal(hexagram.lower.id, 8);
  assert.equal(hexagram.changingIndex, 6);

  for (let i = 0; i < 128; i += 1) {
    const randomHexagram = divine(() => i);
    assert.ok(randomHexagram.upper.id >= 1 && randomHexagram.upper.id <= 8);
    assert.ok(randomHexagram.lower.id >= 1 && randomHexagram.lower.id <= 8);
    assert.ok(randomHexagram.changingIndex >= 1 && randomHexagram.changingIndex <= 6);
  }
});

test("random divination rejects biased uint32 tail values", () => {
  const values = [0, 7, 0xffffffff, 5];
  const hexagram = divine(() => values.shift());
  assert.equal(hexagram.upper.id, 1);
  assert.equal(hexagram.lower.id, 8);
  assert.equal(hexagram.changingIndex, 6);
});

test("hexagram changing logic mirrors the original trigram mutation", () => {
  const hexagram = new Hexagram(eightTrigrams[0], eightTrigrams[0], 1);
  assert.equal(hexagram.changesTo.name, "天風姤");
  assert.equal(hexagram.changesTo.storeSequence, 5);
});

test("all hexagrams can be generated for browsing", () => {
  const all = getAllHexagrams(1);
  assert.equal(all.length, 64);
  assert.equal(all[0].name, "乾為天");
  assert.equal(all[0].storeSequence, 1);
  assert.equal(all[63].name, "坤為地");
  assert.equal(all[63].storeSequence, 64);
  assert.equal(new Set(all.map((hexagram) => hexagram.storeSequence)).size, 64);
});

test("trigram change uses bottom middle top yao positions", () => {
  const qian = eightTrigrams[0];
  assert.equal(qian.change(1).name, "巽");
  assert.equal(qian.change(2).name, "離");
  assert.equal(qian.change(3).name, "兌");
});

test("moving trigram is use, still trigram is body", () => {
  const lowerMoving = new Hexagram(eightTrigrams[0], eightTrigrams[7], 1);
  assert.equal(lowerMoving.externalTrigram.name, "坤");
  assert.equal(lowerMoving.internalTrigram.name, "乾");

  const upperMoving = new Hexagram(eightTrigrams[0], eightTrigrams[7], 4);
  assert.equal(upperMoving.externalTrigram.name, "乾");
  assert.equal(upperMoving.internalTrigram.name, "坤");
});

test("hexagram structure helpers derive mutual opposite and reversed hexagrams", () => {
  const hexagram = new Hexagram(eightTrigrams[3], eightTrigrams[4], 4);
  assert.equal(hexagram.name, "雷風恆");
  assert.equal(hexagram.mutualHexagram.name, "澤天夬");
  assert.equal(hexagram.oppositeHexagram.name, "風雷益");
  assert.equal(hexagram.reversedHexagram.name, "澤山咸");

  const structure = getStructureDesc(hexagram);
  assert.match(structure, /互卦: 澤天夬/);
  assert.match(structure, /錯卦: 風雷益/);
  assert.match(structure, /綜卦: 澤山咸/);
  assert.match(structure, /六爻:/);
});

test("resource data is complete for the migrated display modes", () => {
  for (let i = 1; i <= 64; i += 1) {
    for (const suffix of [
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
    ]) {
      assert.equal(typeof resources.iching[`H_${i}_${suffix}`], "string");
    }
    for (let line = 1; line <= 6; line += 1) {
      assert.equal(typeof resources.iching[`H_${i}_Change${line}`], "string");
    }
  }
  assert.equal(text("main", "MainPageTitle"), "易經占蔔");
});

test("label aliases isolate legacy Hexgram resource key spelling", () => {
  assert.equal(labels.hexagramMain, "卦辭");
  assert.equal(labels.hexagramJudgementClassified, "分類占斷");
  assert.equal(labels.hexagramMeihua, "梅花易術");
});

test("description helpers produce visible text for the default tab set", () => {
  const hexagram = new Hexagram(eightTrigrams[0], eightTrigrams[0], 1);
  assert.match(getMainDesc(hexagram), /乾卦/);
  for (const tab of [
    "main",
    "symbols",
    "poems",
    "judge",
    "classified",
    "structure",
    "meihua",
  ]) {
    assert.ok(getTabContent(hexagram, tab).length > 0);
  }
  assert.match(getTabContent(hexagram, "meihua"), /體卦:/);
  assert.match(getTabContent(hexagram, "meihua"), /分類提示:/);
});
