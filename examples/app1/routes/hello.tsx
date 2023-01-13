import { Head } from "$fresh/runtime.ts";
import {
  css,
  domStyled,
  ResinCssEmitter,
  ResinCssGlobalStyle,
} from "resin-css/mod.ts";
import { globalStyle } from "../utils/global_style.ts";

export default function HelloPage() {
  return (
    <>
      <Head>
        <title>Resin CSS</title>
        {/* embed global style */}
        <ResinCssGlobalStyle css={globalStyle} />
        {/* embed collected css definitions */}
        <ResinCssEmitter />
      </Head>
      <HelloComponent />
    </>
  );
}

function HelloComponent() {
  //attach css to the resulting vdom of FunctionalComponent
  return domStyled(
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
    `,
  );
}
