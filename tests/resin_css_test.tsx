import { assertEquals } from "./deps.ts";
import { css } from "../src/resin_css.ts";

Deno.test("css #1,", () => {
  const cssBall = css`
    border: solid 1px red;
    background: blue;
  `;
  assertEquals(cssBall.className, "cs_0c8f8478");
  assertEquals(
    cssBall.inputCssText,
    `
    border: solid 1px red;
    background: blue;
  `
  );
  assertEquals(
    cssBall.cssText,
    `.cs_0c8f8478{border:solid 1px red; background:blue;}`
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
  assertEquals(cssBall.className, "cs_0424a0f4");
  assertEquals(
    cssBall.cssText,
    `.cs_0424a0f4{width:100px; border-color:red; background:blue;}`
  );
});
