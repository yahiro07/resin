import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { css } from "resin-css/mod.ts";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      class={css`
        width: 60px;
        height: 60px;
        border: solid 1px blue;
        border-radius: 10px;
        background: #fff;
        color: blue;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.5s;
        &:hover {
          background: #cfc;
        }
    `}
      {...props}
      disabled={!IS_BROWSER || props.disabled}
    />
  );
}
