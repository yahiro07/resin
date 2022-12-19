import { Head } from "$fresh/runtime.ts";
import { ResinCssEmitter, ResinCssGlobalStyle } from "resin-css/mod.ts";
import { globalStyle } from "./global_style.ts";

export function CommonHead() {
  return (
    <Head>
      <title>Resin CSS</title>
      <ResinCssEmitter />
      <ResinCssGlobalStyle css={globalStyle} />
    </Head>
  );
}
