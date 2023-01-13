import { createFC, css, domStyled } from "resin-css/mod.ts";
import { CommonHead } from "../utils/CommonHead.tsx";

export default function ZooPage() {
  return (
    <>
      <CommonHead />
      <ZooComponent />
    </>
  );
}

function ZooComponent() {
  return domStyled(
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
  return domStyled(
    <div>{props.iconText}</div>,
    css`
      font-size: 200px;
    `,
  );
});
