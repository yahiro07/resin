import { assertEquals } from "https://deno.land/std@0.94.0/testing/asserts.ts";
import { crc32, css, extractNestedCss } from "./dom_styled_core.ts";

Deno.test("crc32", () => {
  assertEquals(crc32("hello world"), "0d4a1185");
});

Deno.test("extractNestedCss, simple", () => {
  const parsed = extractNestedCss(
    `
      color: red;
      background: pink;
      font-weight: bold;
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo {color: red; background: pink; font-weight: bold;}`
  );
});
