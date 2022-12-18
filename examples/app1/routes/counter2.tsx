import { Head } from "$fresh/runtime.ts";
import {
  css,
  ResinCssEmitter,
  ResinCssGlobalStyle,
  solidify,
} from "resin-css/mod.ts";
import Counter2 from "../islands/Counter2.tsx";
import { globalStyle } from "../utils/global_style.ts";

export default function Counter2Page() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
        <ResinCssEmitter />
        <ResinCssGlobalStyle css={globalStyle} />
      </Head>
      <PageContent />
    </>
  );
}

function PageContent() {
  return solidify(
    <div>
      <p>example for dynamic styling on client side</p>
      <Counter2 start={0} />
    </div>,
    css`
      margin: 20px;
      > p {
        margin-bottom: 10px;
      }
    `,
  );
}
