import main from "../data/main.zh-Hant.json" with { type: "json" };
import iching from "../data/iching.zh-Hant.json" with { type: "json" };

export const resources = {
  main,
  iching,
};

export function text(group, key) {
  const value = resources[group][key];
  if (typeof value !== "string") {
    throw new Error(`Missing resource: ${group}.${key}`);
  }
  return value;
}
