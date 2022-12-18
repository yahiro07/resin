import { useState } from "preact/hooks";
import { css, solidify } from "resin-css/mod.ts";
import { Button } from "../components/Button.tsx";

type Props = {
  start: number;
};

export default function Counter2(props: Props) {
  const [count, setCount] = useState(props.start);

  const colors = ["#f00", "#F80", "#ff0", "#0f0", "#0FF", "#08F", "#80f"];
  return solidify(
    <div>
      <div class="text-part">{count}</div>
      <div class="buttons-part">
        <Button onClick={() => setCount(count + 1)}>+1</Button>
        <Button onClick={() => setCount(count - 1)}>-1</Button>
      </div>
    </div>,
    css`
      display: flex;
      > .text-part {
        border: solid 1px gray;
        color: ${colors[Math.abs(count) % 7 >> 0]};
        width: 200px;
        font-size: 120px;
        font-weight: bold;
        text-align: center;
      }
      > .buttons-part {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border: solid 1px gray;
        width: 80px;
      }
    `
  );
}
