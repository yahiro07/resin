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

export function arrayDiallel<A, B>(ar: A[], br: B[]): [A, B][] {
  const res: [A, B][] = [];
  for (const a of ar) {
    for (const b of br) {
      res.push([a, b]);
    }
  }
  return res;
}

export function groupArrayItems<T>(
  items: T[],
  keyFn: (value: T) => string
): Record<string, T[]> {
  const res: Record<string, T[]> = {};
  for (const item of items) {
    const key = keyFn(item);
    if (!res[key]) {
      res[key] = [];
    }
    res[key].push(item);
  }
  return res;
}

export function uniqueArrayItems<T>(items: T[]): T[] {
  return items.filter((it, index) => items.indexOf(it) == index);
}
