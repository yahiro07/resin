//crc32 function based on https://stackoverflow.com/a/18639999
const makeCRCTable = () => {
  let c;
  const crcTable: number[] = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }
  return crcTable;
};
const crcTable = makeCRCTable();

export const crc32 = (str: string): string => {
  let crc = 0 ^ -1;
  for (let i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xff];
  }
  const value = (crc ^ -1) >>> 0;
  return value.toString(16).padStart(8, "0");
};

export function extractCssTemplate(
  template: TemplateStringsArray,
  values: (string | number)[]
): string {
  let text = "";
  let i = 0;
  for (i = 0; i < values.length; i++) {
    text += template[i];
    const value = values[i].toString();
    text += value;
  }
  text += template[i];
  return text;
}

function transformCssBodyTextToNormalizedLines(cssBodyText: string) {
  return (
    cssBodyText
      //remove comments
      .replace(/\/\*.*\*\//g, "")
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

export function connectPathSegment(path: string, inputSeg: string) {
  let seg = inputSeg;
  if (seg.match(/^[a-zA-Z.#*\[:]/)) {
    seg = ` ${seg}`;
  }
  if (seg.includes("&")) {
    return seg.replace(/&/g, path).trim();
  }
  return path + seg;
}

export function combineSelectorPaths(selectorPaths: string[]) {
  if (selectorPaths.length >= 2) {
    const head = selectorPaths[0];
    const tails = selectorPaths.slice(1);
    return tails.reduce(connectPathSegment, head);
  } else {
    return selectorPaths[0];
  }
}

export function extractNestedCss(
  cssBodyText: string,
  topSelector: string
): string {
  const srcLines = transformCssBodyTextToNormalizedLines(cssBodyText);
  // console.log({ srcLines });

  const cssBlocks: Record<string, string[]> = {};
  const selectorPaths: string[] = [topSelector];

  for (const line of srcLines) {
    if (line.endsWith("{")) {
      const selector = line.slice(0, line.length - 1);
      selectorPaths.push(selector);
    } else if (line.endsWith("}")) {
      selectorPaths.pop();
    } else {
      const selectorPath = combineSelectorPaths(selectorPaths);
      // console.log({ selectorPaths, selectorPath });
      if (!cssBlocks[selectorPath]) {
        cssBlocks[selectorPath] = [];
      }
      cssBlocks[selectorPath].push(line);
    }
  }
  return Object.keys(cssBlocks)
    .map((key) => `${key}{${cssBlocks[key].join(" ")}}`)
    .join("\n");
}
