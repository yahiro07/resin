import { Head } from "$fresh/runtime.ts";
import {
  createFC,
  css,
  ResinCssEmitter,
  ResinCssGlobalStyle,
  solidify,
} from "resin-css/mod.ts";
import { globalStyle } from "../utils/global_style.ts";

export default function ZooPage() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
        <ResinCssGlobalStyle css={globalStyle} />
        <ResinCssEmitter />
      </Head>
      <ZooComponent />
    </>
  );
}

function ZooComponent() {
  return solidify(
    <div>
      <AnimalSprite iconText="🐈" class="cat" />
      <AnimalSprite iconText="🐇" class="rabbit" />
      <AnimalSprite iconText="🐖" class="pig" />
    </div>,
    css`
      margin: 20px;
      border: solid 2px #8a8;
      background: #cfc;
      position: relative;
      width: 700px;
      height: 500px;
      > * {
        position: absolute;
      }
      > .cat {
        left: 10px;
        top: 40px;
        transform: scaleX(-1);
      }
      > .rabbit {
        right: 10px;
        top: 10px;
      }
      > .pig {
        right: 80px;
        top: 220px;
      }
    `,
  );
}

const AnimalSprite = createFC<{ iconText: string }>((props) => {
  return solidify(
    <div>{props.iconText}</div>,
    css`
      font-size: 200px;
    `,
  );
});
