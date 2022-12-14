import { assertEquals } from "./deps.ts";
import { crc32, extractNestedCss } from "../src/dom_styled_core.ts";

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
    `.foo{background:blue; font-size:20px;}
.foo>.bar{color:green; font-weight:bold;}
.foo .buzz{color:red;}`
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
    `.foo{background:blue; font-size:20px;}
.foo .bar{color:purple;}
.foo.buzz{color:orange;}
.foo:hover{color:yellow;}
.foo__inner{color:green;}
.foo--active{color:lime;}`
  );
});
