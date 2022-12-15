import { Head } from "$fresh/runtime.ts";
import {
  css,
  solidify,
  ResinCssEmitter,
  ResinCssGlobalStyle,
} from "resin-css/mod.ts";

//define global style
const globalCss = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    background: #efe;
  }
`;

function HelloComponent() {
  //attach css to the resulting vdom of FunctionalComponent
  return solidify(
    <div>
      <span class="sun">🔆</span>
      Hello World
    </div>,
    css`
      color: blue;
      font-size: 80px;
      font-weight: bold;
      /* can be nested like scss */
      > .sun {
        font-size: 90px;
      }
    `
  );
}

export default function HelloPage() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
        {/* embed global style */}
        <ResinCssGlobalStyle css={globalCss} />
        {/* embed collected css definitions passed to solidify() */}
        <ResinCssEmitter />
      </Head>
      <HelloComponent />
    </>
  );
}
