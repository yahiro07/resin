import { assertEquals } from "./deps.ts";
import { crc32, extractNestedCss } from "../src/resin_css_core.ts";

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
      &.zoo{
        color: pink;
      }
      font-size: 20px;
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo{background:blue; font-size:20px;}
.foo>.bar{color:green; font-weight:bold;}
.foo .buzz{color:red;}
.foo.zoo{color:pink;}`
  );
});

Deno.test("extractNestedCss, nested, single line, condensed", () => {
  const parsed = extractNestedCss(
    `background:blue;>.bar{color:green;font-weight:bold;}.buzz{color:red;}&.zoo{color:pink;}font-size:20px;
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo{background:blue; font-size:20px;}
.foo>.bar{color:green; font-weight:bold;}
.foo .buzz{color:red;}
.foo.zoo{color:pink;}`
  );
});

Deno.test("extractNestedCss, nested, dirty form", () => {
  const parsed = extractNestedCss(
    `  background  :  blue  ; 
     > .bar  {  color: green 
      ;  font-weight  :  

      bold  ; }  .buzz   
      
      { color:red; } & 
      
      .zoo { color  :  
        pink ; } font-size 
         : 20px  ;
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo{background:blue; font-size:20px;}
.foo>.bar{color:green; font-weight:bold;}
.foo .buzz{color:red;}
.foo.zoo{color:pink;}`
  );
});

Deno.test("extractNestedCss, dirty from with comments", () => {
  const parsed = extractNestedCss(
    `  background  :  blue  ; 
     > .bar  {  color: green 
      ;  font-weight  :  
      /* blah blah */
      bold  ; }  .buzz  /*lorem ipsum*/   
      
      { color:red; } & 
      
      .zoo { color  :  
        pink ; /*
        Lorem ipsum dolor sit amet,
         consectetur adipiscing elit, sed do e
         iusmod tempor incididunt ut labore et do
         lore magna aliqua. Ut enim ad minim veniam, 
         quis nostrud exercitation ull
        */
      } font-size  
         : 20px  ;
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo{background:blue; font-size:20px;}
.foo>.bar{color:green; font-weight:bold;}
.foo .buzz{color:red;}
.foo.zoo{color:pink;}`
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
