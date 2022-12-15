import { assertEquals } from "./deps.ts";
import { css } from "../src/resin_css.ts";

Deno.test("css", () => {
  const parsed = css`
    border: solid 1px red;
    background: blue;
  `;
  assertEquals(parsed, "cs_0c8f8478");
});
