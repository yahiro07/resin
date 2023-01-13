import { css } from "resin-css/mod.ts";
import Counter2 from "../islands/Counter2.tsx";
import { CommonHead } from "../utils/CommonHead.tsx";

export default function Counter2Page() {
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
        margin: 20px;
        > p {
          margin-bottom: 10px;
        }
    `}
    >
      <p>example for dynamic styling on client side</p>
      <Counter2 start={0} />
    </div>
  );
}
