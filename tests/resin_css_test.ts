import { assertEquals } from "./deps.ts";
import { css } from "../src/resin_css.ts";

Deno.test("css #1,", () => {
  const cssBall = css`
    border: solid 1px red;
    background: blue;
  `;
  assertEquals(cssBall.className, "cs_5633d4ab");
  assertEquals(cssBall.sourceCssText, `border:solid 1px red;background:blue;`);
  assertEquals(
    cssBall.cssText,
    `.cs_5633d4ab{border:solid 1px red; background:blue;}`,
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
  assertEquals(
    cssBall.sourceCssText,
    `width:100px;border-color:red;background:blue;`,
  );
});

Deno.test("css #3, composition", () => {
  const base = css`
    color: red;
    font-size: 20px;
  `;
  const cssBall = css`
    ${base};
    background: blue;
  `;
  assertEquals(
    cssBall.sourceCssText,
    `color:red;font-size:20px;background:blue;`,
  );
});

Deno.test("css #4, conditional composition", () => {
  const active1 = true;
  const active2 = false;
  const cssBall = css`
    ${
    active1 &&
    css`
      color: red;
    `
  };
    background: blue;
    ${
    active2 &&
    css`
      border-color: green;
    `
  };
  `;
  assertEquals(cssBall.sourceCssText, `color:red;background:blue;`);
});
