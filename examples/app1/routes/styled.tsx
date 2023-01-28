import { CommonHead } from "../utils/CommonHead.tsx";
import { css, domStyled, styled } from "resin-css/mod.ts";

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
      <StyledGreeter name="john" />
      <StyledGreeter2 name="smith" class="smith" />
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

const Greeter = ({ name }: { name: string }) => <div>hello {name}</div>;

const StyledGreeter = styled(Greeter)`
  border: solid 1px orange;
  padding: 20px;
  background: #ff8;
  display: inline-block;
`;

const Greeter2 = ({ name }: { name: string }) => (
  <div
    class={css`
      border-radius: 20px;
    `}
  >
    hello {name}
  </div>
);

const StyledGreeter2 = styled(Greeter2)`
  border: solid 1px #0a0;
  padding: 20px;
  background: #8f8;
  display: inline-block;
`;
