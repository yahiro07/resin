//----------

import { arrayDiallel, groupArrayItems, uniqueArrayItems } from "./helpers.ts";

export function extractCssTemplate(
  template: TemplateStringsArray,
  values: (string | number | { sourceCssText: string } | boolean)[],
  classNameToSourceCssTextMap?: Record<string, string>,
): string {
  let text = "";
  let i = 0;
  for (i = 0; i < values.length; i++) {
    text += template[i];
    const value = values[i];
    if (typeof value === "string" && classNameToSourceCssTextMap?.[value]) {
      text += classNameToSourceCssTextMap[value];
    } else if (
      value === false ||
      value === null ||
      value === undefined ||
      value === ""
    ) {
      //skip
    } else {
      text += value.toString();
    }
  }
  text += template[i];
  return (
    text
      //remove newlines
      .replace(/\s*\r?\n\s*/g, "")
      //remove spaces
      .replace(/\s*([:{\.;>+~,])\s*/g, (_, p1) => p1)
      //remove double semicolon
      .replace(/;;/g, ";")
  );
}

function transformCssBodyTextToNormalizedLines(cssBodyText: string) {
  return (
    cssBodyText
      //remove comments
      .replace(/\/\*.*?\*\//g, "")
      .replace(/\/\/.*\r?\n/g, "")
      //remove spaces
      .replace(/\s*([:{\.;>+~,])\s*/g, (_, p1) => p1)
      //normalize newlines
      .replace(/\r?\n/g, "")
      .replace(/[;{}]/g, (m) => `${m}\n`)
      //split lines
      .split("\n")
      .map((a) => a.trim())
      .filter((a) => !!a)
  );
}

export function concatPathSegment(path: string, seg: string) {
  if (seg.includes("&")) {
    return seg.replace(/&/g, path).trim();
  }
  if (path.match(/\w$/) && seg.match(/^[a-zA-Z.#*\[:]/)) {
    return `${path} ${seg}`;
  } else {
    return `${path}${seg}`;
  }
}

export function concatPathSegmentEx(srcPath: string, inputSeg: string) {
  const srcPaths = srcPath.split(",");
  const inputSegs = inputSeg.split(",");
  return arrayDiallel(srcPaths, inputSegs)
    .map((z) => concatPathSegment(z[0], z[1]))
    .join(",");
}

export function combineSelectorPaths(selectorPaths: string[]) {
  if (selectorPaths.length >= 2) {
    const head = selectorPaths[0];
    const tails = selectorPaths.slice(1);
    return tails.reduce(concatPathSegmentEx, head);
  } else {
    return selectorPaths[0];
  }
}

export function combineMediaQueries(mediaQuerySpecs: string[]): string {
  if (mediaQuerySpecs.length == 0) {
    return "";
  }
  const srcParts = mediaQuerySpecs
    .map((mq) =>
      mq
        .replace(/^@media\s/, "")
        .split("and")
        .map((it) => it.trim())
    )
    .flat();
  const parts = uniqueArrayItems(srcParts);
  return `@media ${parts.join(" and ")}`;
}

type CssSlot = {
  selectorPath: string;
  groupRuleSpec: string;
  cssLines: string[];
};

function prepareCssSlot(
  narrowers: string[],
  cssSlots: Record<string, CssSlot>,
) {
  let selectorPath: string;
  let groupRuleSpec: string;

  const pathPartsKeyframeIndex = narrowers.findIndex((it) =>
    it.startsWith("@keyframes")
  );
  if (pathPartsKeyframeIndex >= 0) {
    groupRuleSpec = narrowers[pathPartsKeyframeIndex];
    const pathParts = narrowers.slice(pathPartsKeyframeIndex + 1);
    selectorPath = combineSelectorPaths(pathParts);
  } else {
    const pathParts = narrowers.filter((it) => !it.startsWith("@media"));
    const mediaQueryParts = narrowers.filter((it) => it.startsWith("@media"));
    selectorPath = combineSelectorPaths(pathParts);
    groupRuleSpec = combineMediaQueries(mediaQueryParts);
  }

  const slotKey = `${groupRuleSpec}${selectorPath}`;
  if (!cssSlots[slotKey]) {
    cssSlots[slotKey] = {
      selectorPath,
      groupRuleSpec,
      cssLines: [],
    };
  }
  return slotKey;
}

function stringifyCssSlots(slots: CssSlot[]) {
  const { groupRuleSpec } = slots[0];
  const cssContentLines = slots.map(
    (slot) => `${slot.selectorPath}{${slot.cssLines.join(" ")}}`,
  );
  if (groupRuleSpec) {
    const cssContents = cssContentLines.map((line) => `  ${line}`).join("\n");
    return `${groupRuleSpec}{\n${cssContents}\n}`;
  } else {
    return cssContentLines.join("\n");
  }
}

function collectKeyframeNames(slots: CssSlot[]): string[] {
  return uniqueArrayItems(
    slots.filter((slot) => slot.groupRuleSpec.startsWith("@keyframes"))
      .map((slot) => slot.groupRuleSpec.match(/^@keyframes ([\w-]+)/)?.[1])
      .filter((it) => !!it) as string[],
  );
}

export function extractNestedCss(
  cssBodyText: string,
  topSelector: string,
): string {
  const srcLines = transformCssBodyTextToNormalizedLines(cssBodyText);

  const cssSlots: Record<string, CssSlot> = {};
  const narrowers: string[] = [topSelector];
  let slotKey = prepareCssSlot(narrowers, cssSlots);

  for (const line of srcLines) {
    if (line.endsWith("{")) {
      const selector = line.slice(0, line.length - 1);
      narrowers.push(selector);
      slotKey = prepareCssSlot(narrowers, cssSlots);
    } else if (line.endsWith("}")) {
      narrowers.pop();
      slotKey = prepareCssSlot(narrowers, cssSlots);
    } else {
      cssSlots[slotKey].cssLines.push(line);
    }
  }
  for (const key in cssSlots) {
    if (cssSlots[key].cssLines.length == 0) {
      delete cssSlots[key];
    }
  }

  const listSlots = Object.values(cssSlots);
  const slotsGroupedByConditionalGroupRule = groupArrayItems(
    listSlots,
    (slot) => slot.groupRuleSpec,
  );

  let cssText = [
    ...Object.values(slotsGroupedByConditionalGroupRule)
      .map(stringifyCssSlots),
  ]
    .join("\n");

  const keyframeNames = collectKeyframeNames(listSlots);
  const topClassName = topSelector.slice(1);
  for (const keyframeName of keyframeNames) {
    cssText = cssText.replaceAll(
      keyframeName,
      `${topClassName}_${keyframeName}`,
    );
  }

  return cssText;
}
