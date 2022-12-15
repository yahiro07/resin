import { Head } from "$fresh/runtime.ts";
import { css, solidify, ResinCssEmitter, createFC } from "resin-css/mod.ts";

const AnimalSprite = createFC<{ iconText: string }>((props) => {
  return solidify(
    <div>{props.iconText}</div>,
    css`
      font-size: 200px;
    `
  );
});

function ZooComponent() {
  return solidify(
    <div>
      <AnimalSprite iconText="🐈" class="cat" />
      <AnimalSprite iconText="🐇" class="rabbit" />
      <AnimalSprite iconText="🐖" class="pig" />
    </div>,
    css`
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
    `
  );
}

export default function ZooPage() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
        <ResinCssEmitter />
      </Head>
      <ZooComponent />
    </>
  );
}
