import { Head } from "$fresh/runtime.ts";
import {
  css,
  solidify,
  ResinCssEmitter,
  ResinCssGlobalStyle,
} from "resin-css/mod.ts";
import Counter2 from "../islands/Counter2.tsx";

const globalCss = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

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
    `
  );
}

export default function Counter2Page() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
        <ResinCssEmitter />
        <ResinCssGlobalStyle css={globalCss} />
      </Head>
      <PageContent />
    </>
  );
}
