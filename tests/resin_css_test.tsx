import { assertEquals } from "./deps.ts";
import { css } from "../src/resin_css.ts";

Deno.test("css", () => {
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
