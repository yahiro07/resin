import { Head } from "$fresh/runtime.ts";
import { css, ResinCssEmitter, ResinCssGlobalStyle } from "resin-css/mod.ts";
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
  return (
    <div
      class={css`
        color: blue;
        font-size: 80px;
        font-weight: bold;
        > .sun {
          font-size: 90px;
        }
    `}
    >
      <span class="sun">🔆</span>
      Hello World
    </div>
  );
}
