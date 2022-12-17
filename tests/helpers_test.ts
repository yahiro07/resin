import { crc32 } from "../src/helpers.ts";
import { assertEquals } from "./deps.ts";

Deno.test("crc32", () => {
  assertEquals(crc32("hello world"), "0d4a1185");
});
