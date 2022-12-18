import { Head } from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";
import {
  css,
  solidify,
  ResinCssEmitter,
  ResinCssGlobalStyle,
} from "resin-css/mod.ts";
import { globalStyle } from "../utils/global_style.ts";

function PageContent() {
  return solidify(
    <div>
      <div class="panel">
        <p class="caption">Counter</p>
        <Counter start={3} />
      </div>
    </div>,
    css`
      height: 100vh;
      background: #eee;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      > .panel {
        width: 400px;
        height: 300px;
        background: #cef;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);

        > .caption {
          font-size: 40px;
          color: #04f;
        }
      }
    `
  );
}

export default function CounterPage() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
        <ResinCssGlobalStyle css={globalStyle} />
        <ResinCssEmitter />
      </Head>
      <PageContent />
    </>
  );
}
