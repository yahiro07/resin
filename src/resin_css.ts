import { FunctionComponent, h, JSX } from "preact";
import { crc32 } from "./helpers.ts";
import { extractCssTemplate, extractNestedCss } from "./resin_css_core.ts";

//----------

//for react
// const jsxCreateElementFunction = createElement;
// const classNameKey = "className";

//for preact
const jsxCreateElementFunction = h;
const classNameKey = "class";
type FC<T> = FunctionComponent<T>;

//----------

type JSXElement = JSX.Element;
type JSXIntrinsicElements = JSX.IntrinsicElements;

type T_ClassName = string;

type CssBall = {
  className: string;
  sourceCssText: string;
  cssText: string;
};

//----------
//stateless helpers

const IS_BROWSER = typeof document !== "undefined";

function addClassToVdom(vdom: JSXElement, className: string): JSXElement {
  const originalClass = vdom.props[classNameKey];
  return {
    ...vdom,
    props: {
      ...vdom.props,
      [classNameKey]: originalClass
        ? `${className} ${originalClass}`
        : className,
    },
  };
}

//----------
//common

const moduleLocalStateCommon = {
  cssBalls: [] as CssBall[],
  classNameToSourceCssTextMap: {} as Record<string, string>,
};

function createCssBallCached(sourceCssText: string): T_ClassName {
  const { cssBalls, classNameToSourceCssTextMap } = moduleLocalStateCommon;
  let cssBall = cssBalls.find((ball) => ball.sourceCssText === sourceCssText);
  if (!cssBall) {
    const inputCssTextMod = sourceCssText.replace(/,\r?\n/g, ",");
    const className = `cs_${crc32(inputCssTextMod)}`;
    const cssText = extractNestedCss(inputCssTextMod, `.${className}`);
    cssBall = { className, sourceCssText, cssText };
    cssBalls.push(cssBall);
    classNameToSourceCssTextMap[className] = sourceCssText;
    emitCssBallToDom(cssBall);
  }
  return cssBall.className;
}

function emitCssBallToDom(cssBall: CssBall) {
  const { className, cssText } = cssBall;
  if (!IS_BROWSER) {
    pushCssTextToEmitterForSsr(className, cssText);
  } else {
    pushCssTextToEmitterForBrowser(className, cssText);
  }
}

//----------
//ssr

const moduleLocalStateForSsr = {
  pageCssTexts: {} as Record<T_ClassName, string>,
};

function pushCssTextToEmitterForSsr(className: string, cssText: string) {
  const { pageCssTexts } = moduleLocalStateForSsr;
  if (!pageCssTexts[className]) {
    pageCssTexts[className] = cssText;
  }
}

function getPageCssFullTextForSsr() {
  return Object.values(moduleLocalStateForSsr.pageCssTexts).join("\n") + "\n";
}

//----------
//browser

const moduleLocalStateForBrowser = {
  pageCssClassNames: undefined as Set<string> | undefined,
};

function getReginCssPageTagNode(): HTMLElement {
  const el = document.getElementById("resin-css-page-css-tag")!;
  if (!el) {
    throw new Error(`page css tag not found for resin-css`);
  }
  return el;
}

function pushCssTextToEmitterForBrowser(className: string, cssText: string) {
  const sb = moduleLocalStateForBrowser;
  if (!sb.pageCssClassNames) {
    sb.pageCssClassNames = new Set();
    const el = getReginCssPageTagNode();
    const matches = el.innerHTML.match(/cs_[0-9a-f]{8}/g);
    if (matches) {
      for (const m of matches) {
        sb.pageCssClassNames.add(m);
      }
    }
  }
  if (!sb.pageCssClassNames.has(className)) {
    const el = getReginCssPageTagNode();
    el.innerHTML += cssText;
    sb.pageCssClassNames.add(className);
  }
}

//----------
//entry

export function css(
  template: TemplateStringsArray,
  ...templateParameters: (string | number | CssBall | boolean)[]
): T_ClassName {
  const { classNameToSourceCssTextMap } = moduleLocalStateCommon;
  const inputCssText = extractCssTemplate(
    template,
    templateParameters,
    classNameToSourceCssTextMap,
  );
  return createCssBallCached(inputCssText);
}

export function getCssBallFromClassName(
  className: string,
): CssBall | undefined {
  const { cssBalls } = moduleLocalStateCommon;
  return cssBalls.find((ball) => ball.className === className);
}

export function domStyled(vdom: JSXElement, className: string): JSXElement {
  return addClassToVdom(vdom, className);
}

export const ResinCssEmitter: FunctionComponent = () => {
  const pageCssFullText = !IS_BROWSER ? getPageCssFullTextForSsr() : "";
  return jsxCreateElementFunction(
    "style",
    {
      id: "resin-css-page-css-tag",
      dangerouslySetInnerHTML: { __html: pageCssFullText },
    },
  );
};

export const ResinCssGlobalStyle: FunctionComponent<{ css: T_ClassName }> = ({
  css: className,
}) => {
  const ball = getCssBallFromClassName(className);
  if (!ball) {
    return null;
  }
  const { cssText } = ball;
  const cssOutputText = cssText.replace(new RegExp(`.${className}`, "g"), "");
  return jsxCreateElementFunction("style", {
    dangerouslySetInnerHTML: { __html: cssOutputText },
  });
};

export function cx(...args: (string | null | undefined | false)[]) {
  return args.filter((a) => !!a).join(" ");
}

type IComponentExtraProps = {
  if?: boolean | undefined;
  class?: string | false;
};

// deno-lint-ignore ban-types
export function createFCX<T extends {}>(
  baseFC: FunctionComponent<T>,
  attachedCssClassName?: string,
): FunctionComponent<T & IComponentExtraProps> {
  return (props: T & IComponentExtraProps) => {
    const { if: propIf = true, class: propClassName, ...baseProps } = props;
    if (!propIf) {
      return null;
    }
    const vdom = baseFC(baseProps as T) as JSXElement;
    const className = cx(propClassName, attachedCssClassName);
    return className ? addClassToVdom(vdom, className) : vdom;
  };
}

export const styled: {
  [K in keyof JSXIntrinsicElements]: (
    ...args: Parameters<typeof css>
  ) => FC<JSXIntrinsicElements[K]>;
} = new Proxy(
  {},
  {
    get<K extends keyof JSXIntrinsicElements>(_target: unknown, tagName: K) {
      return (...args: Parameters<typeof css>) => {
        const attachedCssClassName = css(...args);
        return (props: JSXIntrinsicElements[K]) => {
          const modProps = {
            ...props,
            [classNameKey]: cx(
              props[classNameKey] as string,
              attachedCssClassName,
            ),
          };
          // deno-lint-ignore no-explicit-any
          return jsxCreateElementFunction(tagName as any, modProps);
        };
      };
    },
  },
  // deno-lint-ignore no-explicit-any
) as any;
