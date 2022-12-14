import { assertEquals } from "https://deno.land/std@0.94.0/testing/asserts.ts";
import { crc32, css, extractNestedCss } from "./dom_styled_core.ts";

Deno.test("crc32", () => {
  assertEquals(crc32("hello world"), "0d4a1185");
});

Deno.test("extractNestedCss, flat", () => {
  const parsed = extractNestedCss(
    `
      color: red;
      background: pink;
      font-weight: bold;
    `,
    ".foo"
  );
  assertEquals(parsed, `.foo{color:red; background:pink; font-weight:bold;}`);
});

Deno.test("extractNestedCss, nested", () => {
  const parsed = extractNestedCss(
    `
      background: blue;
      > .bar {
        color: green;
        font-weight: bold;
      }
      .buzz {
        color: red;
      }
      font-size: 20px;
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo{background:blue; font-size:20px;} .foo>.bar{color:green; font-weight:bold;} .foo .buzz{color:red;}`
  );
});

Deno.test("extractNestedCss, nested, with ampersand", () => {
  const parsed = extractNestedCss(
    `
      background: blue;
      .bar {
        color: purple;
      }
      &.buzz {
        color: orange;
      }
      &:hover {
        color: yellow;
      }
      &__inner {
        color: green;
      }
      &--active {
        color: lime;
      }
      font-size: 20px;
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo{background:blue; font-size:20px;} .foo .bar{color:purple;} .foo.buzz{color:orange;} .foo:hover{color:yellow;} .foo__inner{color:green;} .foo--active{color:lime;}`
  );
});

Deno.test("css", () => {
  const parsed = css`
    border: solid 1px red;
    background: blue;
  `;
  assertEquals(parsed, ".cs_0c8f8478{border:solid 1px red; background:blue;}");
});
