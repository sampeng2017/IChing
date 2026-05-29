import solarLunar from "solarlunar";
import { text } from "./resources.js";

export const supportedDateRange = Object.freeze({
  start: new Date(1900, 0, 31),
  endExclusive: new Date(2101, 0, 1),
});

export const chineseNumber = [
  "ChineseOne",
  "ChineseTwo",
  "ChineseThree",
  "ChineseFour",
  "ChineseFive",
  "ChineseSix",
  "ChineseSeven",
  "ChineseEight",
  "ChineseNine",
  "ChineseTen",
  "ChineseEleven",
  "ChineseTwo",
].map((key) => text("main", key));

export const animalSigns = [
  "ChineseZodiacRat",
  "ChineseZodiacOx",
  "ChineseZodiacTiger",
  "ChineseZodiacRabbit",
  "ChineseZodiacDragon",
  "ChineseZodiacSnake",
  "ChineseZodiacHorse",
  "ChineseZodiacRam",
  "ChineseZodiacMonkey",
  "ChineseZodiacRooster",
  "ChineseZodiacDog",
  "ChineseZodiacPig",
].map((key) => text("main", key));

export const heavenlyStems = [
  "HeavenlyStemsJia",
  "HeavenlyStemsYi",
  "HeavenlyStemsBing",
  "HeavenlyStemsDing",
  "HeavenlyStemsWu",
  "HeavenlyStemsJi",
  "HeavenlyStemsGeng",
  "HeavenlyStemsXin",
  "HeavenlyStemsRen",
  "HeavenlyStemsKui",
].map((key) => text("main", key));

export const earthlyBranches = [
  "EarthlyBranchesZi",
  "EarthlyBranchesChou",
  "EarthlyBranchesYin",
  "EarthlyBranchesMao",
  "EarthlyBranchesChen",
  "EarthlyBranchesSi",
  "EarthlyBranchesWu",
  "EarthlyBranchesWei",
  "EarthlyBranchesShen",
  "EarthlyBranchesYou",
  "EarthlyBranchesXu",
  "EarthlyBranchesHai",
].map((key) => text("main", key));

export function leapMonth(year) {
  return solarLunar.leapMonth(year);
}

export function leapDays(year) {
  return solarLunar.leapDays(year);
}

export function monthDays(year, month) {
  return solarLunar.monthDays(year, month);
}

export function yearDays(year) {
  if (year < 1900 || year > 2100) {
    throw new RangeError(`Unsupported lunar calendar year: ${year}`);
  }
  return solarLunar.lYearDays(year);
}

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function supportedDateRangeText() {
  return `${formatDate(supportedDateRange.start)} to ${formatDate(addDays(supportedDateRange.endExclusive, -1))}`;
}

export function assertSupportedDate(dateTime) {
  const day = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate());
  if (day < supportedDateRange.start || day >= supportedDateRange.endExclusive) {
    throw new RangeError(
      `Chinese lunar calendar supports Gregorian dates from ${supportedDateRangeText()}.`,
    );
  }
}

export function toChineseNumber(num) {
  if (num <= 0 || num >= 32) throw new RangeError("num must be 1..31");
  const tenth = Math.floor(num / 10);
  let result = "";
  if (tenth > 0) {
    result = chineseNumber[9];
    if (tenth > 1) result = chineseNumber[tenth - 1] + result;
  }
  if (num % 10 > 0) result += chineseNumber[(num % 10) - 1];
  return result;
}

export function getChineseTwoHourPeriod(dateTime) {
  let hour = dateTime.getHours() + 1;
  hour = hour === 24 ? 0 : hour;
  return Math.floor(hour / 2) + 1;
}

export class ChineseCalendarDate {
  constructor(inputDate) {
    let dateTime = new Date(inputDate.getTime());
    this.chineseTwoHourPeriod = getChineseTwoHourPeriod(dateTime);
    if (dateTime.getHours() === 23) {
      dateTime = new Date(dateTime.getTime() + 86400000);
    }
    assertSupportedDate(dateTime);

    const lunarDate = solarLunar.solar2lunar(
      dateTime.getFullYear(),
      dateTime.getMonth() + 1,
      dateTime.getDate(),
    );

    if (lunarDate === -1) {
      throw new RangeError(
        `Chinese lunar calendar supports Gregorian dates from ${supportedDateRangeText()}.`,
      );
    }

    this.year = lunarDate.lYear;
    this.month = lunarDate.lMonth;
    this.day = lunarDate.lDay;
    this.isLeapMonth = lunarDate.isLeap;
  }

  get earthlyBranchValue() {
    return ((this.year - 1900 + 36) % 12) + 1;
  }

  get earthlyBranchString() {
    return earthlyBranches[this.earthlyBranchValue - 1];
  }

  get heavenlyStemString() {
    return heavenlyStems[(this.year - 1900 + 36) % 10];
  }

  get yearAnimalSign() {
    return animalSigns[(this.year - 4) % 12];
  }

  get chineseTwoHourPeriodString() {
    return earthlyBranches[this.chineseTwoHourPeriod - 1];
  }

  toString() {
    return `${this.heavenlyStemString}${this.earthlyBranchString}(${this.yearAnimalSign})${text("main", "ChineseCharYear")}${this.isLeapMonth ? text("main", "ChineseCharLeap") : ""}${toChineseNumber(this.month)}${text("main", "ChineseCharMonth")}${toChineseNumber(this.day)}${text("main", "ChineseCharDay")}${this.chineseTwoHourPeriodString}${text("main", "ChineseCharHour")}`;
  }
}
