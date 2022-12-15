import { assertEquals } from "./deps.ts";
import { crc32, extractNestedCss } from "../src/resin_css_core.ts";

//dummy function locally used
function css(
  template: TemplateStringsArray,
  ...values: (string | number)[]
): string {
  let text = "";
  let i = 0;
  for (i = 0; i < values.length; i++) {
    text += template[i];
    const value = values[i].toString();
    text += value;
  }
  text += template[i];
  return text;
}

Deno.test("crc32", () => {
  assertEquals(crc32("hello world"), "0d4a1185");
});

Deno.test("extractNestedCss, flat", () => {
  const parsed = extractNestedCss(
    css`
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
    css`
      background: blue;
      > .bar {
        color: green;
        font-weight: bold;
      }
      .buzz {
        color: red;
      }
      &.zoo {
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
     > .bar  {  color: green  // comment to line end
      ;  font-weight  :  
      /* blah blah */
      bold  ; }  .buzz  /*lorem ipsum*/   
      
      { color:red; } &  //comment
      //comment
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
    css`
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
      &::after {
        color: violet;
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
.foo--active{color:lime;}
.foo::after{color:violet;}`
  );
});

Deno.test("extractNestedCss, various selectors", () => {
  const parsed = extractNestedCss(
    css`
      color: blue;
      h1 {
        color: red;
      }
      > h2 {
        color: yellow;
      }
      + h3 {
        color: green;
      }
      ~ h4 {
        color: #f08;
      }
      * {
        color: #08f;
      }
      #bar {
        color: #123;
      }
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo{color:blue;}
.foo h1{color:red;}
.foo>h2{color:yellow;}
.foo+h3{color:green;}
.foo~h4{color:#f08;}
.foo *{color:#08f;}
.foo #bar{color:#123;}`
  );
});

Deno.test("extractNestedCss, comma separated selectors", () => {
  const parsed = extractNestedCss(
    css`
      color: blue;
      p,
      div,
      .class,
      #id {
        color: red;
      }
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo{color:blue;}
.foo p,div,.class,#id{color:red;}`
  );
});

Deno.test("extractNestedCss, cascaded nesting", () => {
  const parsed = extractNestedCss(
    css`
      > div > p > span {
        color: red;
      }
      h1 p span {
        color: blue;
      }
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo>div>p>span{color:red;}
.foo h1 p span{color:blue;}`
  );
});

Deno.test("extractNestedCss, dev1", () => {
  const parsed = extractNestedCss(
    css`
      h3 + p {
        color: red;
      }
    `,
    ".foo"
  );
  assertEquals(parsed, `.foo h3+p{color:red;}`);
});

Deno.test("extractNestedCss, dev2", () => {
  const parsed = extractNestedCss(
    css`
      p:first-child {
        color: red;
      }
      p:not(.text) {
        color: blue;
      }
      h1::before {
        color: green;
      }
      input[type="text"] {
        color: orange;
      }
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo p:first-child{color:red;}
.foo p:not(.text){color:blue;}
.foo h1::before{color:green;}
.foo input[type="text"]{color:orange;}`
  );
});

Deno.test("extractNestedCss, dev3, multilevel nesting", () => {
  const parsed = extractNestedCss(
    css`
      color: white;
      .bar {
        color: red;
        .buzz {
          color: green;
          .boo {
            color: blue;
          }
        }
      }
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo{color:white;}
.foo .bar{color:red;}
.foo .bar .buzz{color:green;}
.foo .bar .buzz .boo{color:blue;}`
  );
});

Deno.test("extractNestedCss, dev4, multilevel nesting", () => {
  const parsed = extractNestedCss(
    css`
      color: white;
      > .bar {
        color: red;
        > .buzz {
          color: green;
          > .boo {
            color: blue;
          }
        }
      }
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo{color:white;}
.foo>.bar{color:red;}
.foo>.bar>.buzz{color:green;}
.foo>.bar>.buzz>.boo{color:blue;}`
  );
});

Deno.test("extractNestedCss, dev5", () => {
  const parsed = extractNestedCss(
    css`
      div {
        color: white;
        + div {
          color: red;
        }
        > h1 {
          color: blue;
        }
      }
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo div{color:white;}
.foo div+div{color:red;}
.foo div>h1{color:blue;}`
  );
});

Deno.test("extractNestedCss, dev6", () => {
  const parsed = extractNestedCss(
    css`
      width: 1200px;
      @media screen and (max-width: 640px) {
        width: 100%;
      }
    `,
    ".foo"
  );
  //TODO: support media query
  //   assertEquals(
  //     parsed,
  //     `.foo{width: 1200px;}
  // @media screen and (max-width: 640px) {
  // .foo{width: 100%;}`
  //   );
});

Deno.test("extractNestedCss, dev7", () => {
  const parsed = extractNestedCss(
    css`
      color: red;
      .parent & {
        color: blue;
      }
      & + & {
        color: green;
      }
    `,
    ".foo"
  );
  // assertEquals(
  //   parsed,
  //   `.foo{color:red;}
  // .parent .foo{color:blue;}
  // .foo+.foo{color:green;}`
  // );
});

Deno.test("extractNestedCss, dev8", () => {
  const parsed = extractNestedCss(
    css`
      color: red;
      .bar[data-active="true"] {
        color: blue;
      }
      &[data-active="true"] {
        color: green;
      }
      [data-active="true"] {
        color: yellow;
      }
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo{color:red;}
.foo .bar[data-active="true"]{color:blue;}
.foo[data-active="true"]{color:green;}
.foo [data-active="true"]{color:yellow;}`
  );
});
