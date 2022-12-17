import { assertEquals } from "./deps.ts";
import {
  combineMediaQueries,
  combineSelectorPaths,
  concatPathSegment,
  concatPathSegmentEx,
  extractNestedCss,
} from "../src/resin_css_core.ts";

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

Deno.test("connectPathSegment #1", () => {
  assertEquals(concatPathSegment(".foo", ">.bar"), ".foo>.bar");
  assertEquals(concatPathSegment(".foo", "+.bar"), ".foo+.bar");
  assertEquals(concatPathSegment(".foo", "&.bar"), ".foo.bar");
  assertEquals(concatPathSegment(".foo", ".bar"), ".foo .bar");
  assertEquals(concatPathSegment("div", "h1"), "div h1");
  assertEquals(concatPathSegment(".foo", "*"), ".foo *");
  assertEquals(
    concatPathSegment("input", `&[type="number"]`),
    `input[type="number"]`
  );
  assertEquals(
    concatPathSegment("input", `[type="number"]`),
    `input [type="number"]`
  );
  assertEquals(concatPathSegment(".foo", ".parent &"), ".parent .foo");
  assertEquals(concatPathSegment(".foo", "&+&"), ".foo+.foo");

  assertEquals(concatPathSegment(".foo .bar", "&:buzz"), ".foo .bar:buzz");
  assertEquals(concatPathSegment(".foo>.bar", "&+&"), ".foo>.bar+.foo>.bar");
  assertEquals(concatPathSegment(".foo .bar", "&+&"), ".foo .bar+.foo .bar");
  assertEquals(
    concatPathSegment(".foo .bar", ".parent+&"),
    ".parent+.foo .bar"
  );
  assertEquals(concatPathSegment(".box", "& &__element"), ".box .box__element");
});

Deno.test("connectPathSegmentEx #1, selector list", () => {
  assertEquals(
    concatPathSegmentEx(".base", "p,div,span"),
    ".base p,.base div,.base span"
  );
  assertEquals(concatPathSegmentEx(".aa,.bb", ">p"), ".aa>p,.bb>p");
  assertEquals(
    concatPathSegmentEx(".base", ">p,>div,>span"),
    ".base>p,.base>div,.base>span"
  );
  assertEquals(
    concatPathSegmentEx(".aa,.bb", ">.cc,>.dd"),
    ".aa>.cc,.aa>.dd,.bb>.cc,.bb>.dd"
  );
});

Deno.test("combineSelectorPaths #1", () => {
  assertEquals(combineSelectorPaths([".foo"]), ".foo");
  assertEquals(combineSelectorPaths([".foo", ">.bar"]), ".foo>.bar");
  assertEquals(combineSelectorPaths([".foo", ".bar"]), ".foo .bar");
  assertEquals(combineSelectorPaths([".foo", "&.bar"]), ".foo.bar");
  assertEquals(combineSelectorPaths([".foo", "&:hover"]), ".foo:hover");
  assertEquals(combineSelectorPaths([".foo", "&__inner"]), ".foo__inner");
  assertEquals(combineSelectorPaths([".foo", "&--active"]), ".foo--active");
  assertEquals(combineSelectorPaths([".foo", "&::before"]), ".foo::before");
  assertEquals(combineSelectorPaths([".foo", "+.bar"]), ".foo+.bar");
  assertEquals(combineSelectorPaths([".foo", "*"]), ".foo *");
  assertEquals(combineSelectorPaths([".foo", "#bar"]), ".foo #bar");
  assertEquals(combineSelectorPaths([".foo", ":hover"]), ".foo :hover");
  assertEquals(combineSelectorPaths([".foo", "::before"]), ".foo ::before");

  assertEquals(combineSelectorPaths([".foo", ".parent &"]), ".parent .foo");
  assertEquals(combineSelectorPaths([".foo", "&+&"]), ".foo+.foo");

  assertEquals(
    combineSelectorPaths([".box", "& &__element"]),
    ".box .box__element"
  );
  assertEquals(
    combineSelectorPaths([".box", "& &__element", "&--modifier"]),
    ".box .box__element--modifier"
  );
  assertEquals(
    combineSelectorPaths(["#main", " span", "+span"]),
    "#main span+span"
  );
  assertEquals(combineSelectorPaths(["#main", ">p"]), "#main>p");

  assertEquals(combineSelectorPaths(["ul>", "li"]), "ul>li");
  assertEquals(combineSelectorPaths(["h2", "+p"]), "h2+p");
  assertEquals(combineSelectorPaths(["p", "~", "span"]), "p~span");

  assertEquals(combineSelectorPaths([".alert", "&:hover"]), ".alert:hover");
  assertEquals(
    combineSelectorPaths([".alert", "[dir=rtl] &"]),
    "[dir=rtl] .alert"
  );
  assertEquals(combineSelectorPaths([".alert", ":not(&)"]), ":not(.alert)");
});

Deno.test("combineSelectorPaths #2, selector list", () => {
  assertEquals(
    combineSelectorPaths([".base", "p,div,span"]),
    ".base p,.base div,.base span"
  );
  assertEquals(combineSelectorPaths([".aa,.bb", ">p"]), ".aa>p,.bb>p");
  assertEquals(
    combineSelectorPaths([".base", ">p,>div,>span"]),
    ".base>p,.base>div,.base>span"
  );
  assertEquals(
    combineSelectorPaths([".aa,.bb", ">.cc,>.dd"]),
    ".aa>.cc,.aa>.dd,.bb>.cc,.bb>.dd"
  );
  assertEquals(
    combineSelectorPaths([".base", ".aa,.bb", ".cc,.dd"]),
    ".base .aa .cc,.base .aa .dd,.base .bb .cc,.base .bb .dd"
  );
});

Deno.test("combineMediaQueries #1", () => {
  assertEquals(
    combineMediaQueries([
      "@media screen and (max-width:640px)",
      "@media screen and (min-width:320px)",
    ]),
    "@media screen and (max-width:640px) and (min-width:320px)"
  );
});

Deno.test("extractNestedCss #1, flat", () => {
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

Deno.test("extractNestedCss #2, nested", () => {
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

Deno.test("extractNestedCss #3, nested, single line, condensed", () => {
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

Deno.test("extractNestedCss #4, nested, dirty form", () => {
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

Deno.test("extractNestedCss #5, dirty form with comments", () => {
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

Deno.test("extractNestedCss #6, nested, with ampersand", () => {
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

Deno.test("extractNestedCss #7, various selectors", () => {
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

Deno.test("extractNestedCss #8, cascaded nesting", () => {
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

Deno.test("extractNestedCss #9", () => {
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

Deno.test("extractNestedCss #10", () => {
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

Deno.test("extractNestedCss #11, multilevel nesting", () => {
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

Deno.test("extractNestedCss #12, multilevel nesting", () => {
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

Deno.test("extractNestedCss #13", () => {
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

Deno.test("extractNestedCss #14, media query", () => {
  const parsed = extractNestedCss(
    css`
      width: 1200px;
      @media screen and (max-width: 640px) {
        width: 100%;
      }
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo{width:1200px;}
@media screen and (max-width:640px){
  .foo{width:100%;}
}`
  );
});

Deno.test("extractNestedCss #15, parent selector", () => {
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
  assertEquals(
    parsed,
    `.foo{color:red;}
.parent .foo{color:blue;}
.foo+.foo{color:green;}`
  );
});

Deno.test("extractNestedCss #16", () => {
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

Deno.test("extractNestedCss #17", () => {
  const parsed = extractNestedCss(
    css`
      > p {
        color: red;
        + p {
          color: blue;
        }
      }
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo>p{color:red;}
.foo>p+p{color:blue;}`
  );
});

Deno.test("extractNestedCss #18", () => {
  const parsed = extractNestedCss(
    css`
      :hover {
        color: yellow;
      }
      &:hover {
        color: black;
      }

      p {
        &:hover {
          color: blue;
        }
        > span {
          &:hover {
            color: green;
          }
        }
      }
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo :hover{color:yellow;}
.foo:hover{color:black;}
.foo p:hover{color:blue;}
.foo p>span:hover{color:green;}`
  );
});

Deno.test("extractNestedCss #19, selector list", () => {
  const parsed = extractNestedCss(
    css`
      color: blue;
      p,
      div,
      span {
        color: red;
      }

      .aa,
      .bb {
        .cc,
        .dd {
          color: yellow;
        }
      }
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo{color:blue;}
.foo p,.foo div,.foo span{color:red;}
.foo .aa .cc,.foo .aa .dd,.foo .bb .cc,.foo .bb .dd{color:yellow;}`
  );
});

Deno.test("extractNestedCss #20, media query", () => {
  const parsed = extractNestedCss(
    css`
      color: blue;
      @media screen and (max-width: 640px) {
        color: red;
        .bar {
          color: green;
        }
        @media screen and (min-width: 320px) {
          color: yellow;
        }
      }

      .buzz {
        @media screen and (min-width: 480px) {
          color: pink;
        }
      }
    `,
    ".foo"
  );
  assertEquals(
    parsed,
    `.foo{color:blue;}
@media screen and (max-width:640px){
  .foo{color:red;}
  .foo .bar{color:green;}
}
@media screen and (max-width:640px) and (min-width:320px){
  .foo{color:yellow;}
}
@media screen and (min-width:480px){
  .foo .buzz{color:pink;}
}`
  );
});
