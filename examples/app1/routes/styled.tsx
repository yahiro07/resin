import { css, styled } from "resin-css/mod.ts";
import { CommonHead } from "../utils/CommonHead.tsx";

export default function StyledPage() {
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
        padding: 20px;
        display: flex;
        gap: 20px;
        > .smith {
          font-weight: bold;
        }
      `}
    >
      <RoundBadge id="badge1" data-foo="bar">
        ⭐
      </RoundBadge>
    </div>
  );
}

const RoundBadge = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #08f;
  &:hover {
    background: #0cf;
  }
`;
