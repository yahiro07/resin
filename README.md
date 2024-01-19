# Resin CSS

<img align="right" src="https://raw.githubusercontent.com/yahiro07/resin/main/resin_logo.png" height="160px" alt="the resin logo: two bottles labeled CSS and JS">

A small css-in-js library works with Deno and Fresh.

The usage is mostly compatible to Emotion. 

## Usage

### import

```ts
import {
  css,
  ResinCssEmitter
} from "https://deno.land/x/resin/mod.ts";
```

Just import the code from your Deno+Fresh app. No configurations required.

### Styling a component

Here is a basic function component with inline css.

```tsx
function HelloComponent() {
  return (
    <div
      class={css`
        color: blue;
        font-size: 80px;
        font-weight: bold;
        > .sun {
          font-size: 90px;
        }
    `}
    >
      <span class="sun">🔆</span>
      Hello World
    </div>
  );
}
```

`css()` takes a string literal. The syntax of css text is basically compatible to SCSS. Multi-stage nesting is supported.

It internally creates a unique class name for the input css text. It also creates a converted css texts prefixed with the class selector. The css definitions are collected and they are awaiting for the emission.

### Embed collected CSS to the page

```tsx
export default function HelloPage() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
        <ResinCssEmitter />
      </Head>
      <HelloComponent />
    </>
  );
}
```

Here is a page component for a route. `<ResinCssEmitter />` embeds the collected css definitions into `<head>` tag. A single `<style>` tag is created and all css are settled in this tag.

### Global Style

If you want to write a global css, refer the code below.

```ts
const globalCss = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

export default function HelloPage() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
        <ResinCssEmitter />
        <ResinCssGlobalStyle css={globalCss} />
      </Head>
      <HelloComponent />
    </>
  );
}
```

`<ResinCssGlobalStyle />` embeds given css definition to the page without prefix. So the definition is regarded as global-scoped.


### domStyled API

There is an api named `domStyled`. It takes jsx vdom as first argument and css inline style definition as the second argument.

It just set the generated className to the class prop of root element of the vdom. This might be readable since the code nesting is shallower than class={css\`...\`} inline spec.

```ts
function HelloComponent() {
  return domStyled(
    <div>
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

### styled API
```tsx
const RedButton = styled.button`
  background: red;
`;
```
styled-components compatible styled() API is provided.
It only supports plain dom element arguments.
Function component arguments like `styled(Button)` are not supported.

### createFCX API

There is a component wrapper function `createFCX`. It wraps a function component
and provide class prop to the caller. It is convenient when customizing the style
of child elements in the parent context.

```tsx
//create wrapped component, it accepts additional class prop
const AnimalSprite = createFCX<{ iconText: string }>((props) => {
  return (
    <div class={css` font-size: 200px; `}>
      {props.iconText}
    </div>
  );
});

function ZooComponent() {
  //apply customized style to children in parent component
  return (
    <div class={css`
      position: relative;
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
    `}>
      <AnimalSprite iconText="🐈" class="cat" />
      <AnimalSprite iconText="🐇" class="rabbit" />
    </div>
  );
}
```

It also provides if props.
```tsx
  { catVisible && <AnimalSprite iconText="🐈" /> }
   <AnimalSprite iconText="🐈" if={catVisible} />
```
The two lines of the code above renders the same result.
(It is rendered only when `catVisible` is true)

if props make the code a little readable.


## Style composition

A style definition can be embed into another by string interpolation.

```tsx
const base = css`
  color: red;
  font-size: 20px;
`;

const extended = css`
  ${base};
  background: blue;
`;
```


## Notes

There seemed to be some condition the style is not affected in SSR.
It might be resolved by the workaround to write style emitters at the bottom of the dom tree, as the code below.

```tsx
export default function HelloPage() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <HelloComponent />
      
      <ResinCssEmitter />
      <ResinCssGlobalStyle css={globalCss} />
    </>
  );
}

```

I'm considering writing Fresh plugin so as we do not need to insert these emitters manually.





## License

MIT License
