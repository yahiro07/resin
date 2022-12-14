import { Head } from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";
import {
  css,
  domStyled,
  DomStyledCssEmitter,
  DomStyledGlobalStyle,
} from "dom-styled/mod.ts";

const globalCss = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html,
  body {
    height: 100%;
  }
`;

function PageContent() {
  return domStyled(
    <div>
      <div class="panel">
        <p class="hello">Hello World!!</p>
        <Counter start={3} />
      </div>
    </div>,
    css`
      height: 100%;
      background: #eee;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      > .panel {
        width: 400px;
        height: 300px;
        background: lightblue;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);

        > .hello {
          font-size: 40px;
          color: green;
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
        <DomStyledGlobalStyle css={globalCss} />
        <DomStyledCssEmitter />
      </Head>
      <PageContent />
    </>
  );
}
