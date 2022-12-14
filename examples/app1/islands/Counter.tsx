import { useState } from "preact/hooks";
import { css, domStyled } from "../../../mod.ts";
import { Button } from "../components/Button.tsx";

interface CounterProps {
  start: number;
}

export default function Counter(props: CounterProps) {
  const [count, setCount] = useState(props.start);
  return domStyled(
    <div>
      <div class="text-part">
        <p>{count}</p>
      </div>
      <div class="buttons-part">
        <Button onClick={() => setCount(count + 1)}>+1</Button>
        <Button onClick={() => setCount(count - 1)}>-1</Button>
      </div>
    </div>,
    css`
      display: flex;
      > .text-part {
        border: solid 1px blue;
        color: #008;
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
        border: solid 1px blue;
        width: 80px;
      }
    `
  );
}
