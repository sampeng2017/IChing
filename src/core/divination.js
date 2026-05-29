import { ChineseCalendarDate } from "./chinese-calendar.js";
import { eightTrigrams, Hexagram } from "./bagua.js";

export function defaultRandomUInt32() {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.getRandomValues) {
    const value = new Uint32Array(1);
    cryptoApi.getRandomValues(value);
    return value[0];
  }
  return Math.floor(Math.random() * 0x100000000);
}

function oneBasedRandom(maxInclusive, randomUInt32 = defaultRandomUInt32) {
  const sampleSize = 0x100000000;
  const maxUnbiased = sampleSize - (sampleSize % maxInclusive);
  let value = randomUInt32();
  while (value >= maxUnbiased) {
    value = randomUInt32();
  }
  return (value % maxInclusive) + 1;
}

function normalizeModulo(value, modulus) {
  const result = value % modulus;
  return result === 0 ? modulus : result;
}

export function divine(randomUInt32 = defaultRandomUInt32) {
  const upper = oneBasedRandom(8, randomUInt32);
  const lower = oneBasedRandom(8, randomUInt32);
  const change = oneBasedRandom(6, randomUInt32);
  return new Hexagram(eightTrigrams[upper - 1], eightTrigrams[lower - 1], change);
}

export function divineByTime(dateTime) {
  const lunarDate = new ChineseCalendarDate(dateTime);
  const upperValue = lunarDate.earthlyBranchValue + lunarDate.month + lunarDate.day;
  const upperTrigramValue = normalizeModulo(upperValue, 8);
  const upperTrigram = eightTrigrams[upperTrigramValue - 1];

  const lowerValue = upperValue + lunarDate.chineseTwoHourPeriod;
  const lowerTrigramValue = normalizeModulo(lowerValue, 8);
  const lowerTrigram = eightTrigrams[lowerTrigramValue - 1];

  const changing = normalizeModulo(lowerValue, 6);
  return new Hexagram(upperTrigram, lowerTrigram, changing);
}

export function divineNow() {
  return divineByTime(new Date());
}
