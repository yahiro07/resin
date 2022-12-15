# dom-styled

A lightweight css-in-js library works with Deno and Fresh.

## Usage

### Styling a component

Here is a basic FunctionalComponent using dom-styled.

```tsx
function HelloComponent() {
  return domStyled(
    <div>
      <span class="sun">🔆</span>
      Hello World
    </div>,
    css`
      color: blue;
      font-size: 80px;
      font-weight: bold;
      > .sun {
        font-size: 90px;
      }
    `,
  );
}
```

`css()` and `domStyled()` are core API to make the resuting vdom styled for
FunctionalComponent. css() takes a string literal. The syntax of css text is
basically compatible to SCSS. Multi-stage nesting is supported.

domStyled() internally creates a unique className for the css and add the
className prop to the vdom. It also creates a converted css texts prefixed with
the className. The css definitions are collected and they are awaiting for the
emittion.

### Embed collected CSS to the page

```tsx
export default function HelloPage() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
        <DomStyledCssEmitter />
      </Head>
      <HelloComponent />
    </>
  );
}
```

Here is a page component for a route. `<DomStyledCssEmitter />` embeds the
collected css definitions into `<head>` tag. A single `<style>` tag is created
and all css are settled in this tag.

### Global Style

If you want to write the global css, refer the code below.

```ts
const globalCss = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    background: #efe;
  }
`;

export default function HelloPage() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
        <DomStyledGlobalStyle css={globalCss} />
      </Head>
      <HelloComponent />
    </>
  );
}
```

`<DomStyledGlobalStyle />` embeds given css definition to the page without
prefix. So the definition is regarded as global scoped.

## License

MIT License
