import { assertEquals } from "./deps.ts";
import { css, extractCssTemplate } from "../src/resin_css.ts";

Deno.test("extractCssTemplate #1,", () => {
  const parsed = extractCssTemplate`
    border: solid 1px red;
    background: blue;
  `;
  assertEquals(parsed, `border: solid 1px red;background: blue;`);
});

Deno.test("css #1,", () => {
  const cssBall = css`
    border: solid 1px red;
    background: blue;
  `;
  assertEquals(cssBall.className, "cs_91bfb93f");
  assertEquals(cssBall.inputCssText, `border: solid 1px red;background: blue;`);
  assertEquals(
    cssBall.cssText,
    `.cs_91bfb93f{border:solid 1px red; background:blue;}`
  );
});

Deno.test("css #2, embed values", () => {
  const width = 100;
  const borderColor = "red";
  const cssBall = css`
    width: ${width}px;
    border-color: ${borderColor};
    background: blue;
  `;
  assertEquals(cssBall.className, "cs_6ff2292b");
  assertEquals(
    cssBall.cssText,
    `.cs_6ff2292b{width:100px; border-color:red; background:blue;}`
  );
});

Deno.test("css #2, composition", () => {
  const base = css`
    color: red;
    font-size: 20px;
  `;
  const cssBall = css`
    ${base};
    background: blue;
  `;
  assertEquals(cssBall.className, "cs_e660e319");
  assertEquals(
    cssBall.inputCssText,
    `color: red;font-size: 20px;background: blue;`
  );
  assertEquals(
    cssBall.cssText,
    `.cs_e660e319{color:red; font-size:20px; background:blue;}`
  );
});
