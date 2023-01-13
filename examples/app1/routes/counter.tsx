import { css } from "resin-css/mod.ts";
import Counter from "../islands/Counter.tsx";
import { CommonHead } from "../utils/CommonHead.tsx";

export default function CounterPage() {
  return (
    <>
      <CommonHead />
      <PageContent />
    </>
  );
}

function PageContent() {
  return (
    <div
      class={css`
        height: 100vh;
        background: #eee;
        padding: 40px;

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
    `}
    >
      <div class="panel">
        <p class="caption">Counter</p>
        <Counter start={3} />
      </div>
    </div>
  );
}
