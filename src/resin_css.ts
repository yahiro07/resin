import { FunctionComponent, h, JSX } from "preact";
import { crc32 } from "./helpers.ts";
import { extractCssTemplate, extractNestedCss } from "./resin_css_core.ts";

type JSXElement = JSX.Element;

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
  const originalClass = vdom.props.class;
  return {
    ...vdom,
    props: {
      ...vdom.props,
      class: originalClass ? `${className} ${originalClass}` : className,
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

export function getCssBallFromClassName(
  className: string,
): CssBall | undefined {
  const { cssBalls } = moduleLocalStateCommon;
  return cssBalls.find((ball) => ball.className === className);
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

function pushCssTextToEmitterForBrowser(
  className: string,
  cssText: string,
) {
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

function emitCssBallToDom(cssBall: CssBall) {
  const { className, cssText } = cssBall;
  if (!IS_BROWSER) {
    pushCssTextToEmitterForSsr(className, cssText);
  } else {
    pushCssTextToEmitterForBrowser(className, cssText);
  }
}

export function domStyled(vdom: JSXElement, className: string): JSXElement {
  return addClassToVdom(vdom, className);
}

export const ResinCssEmitter: FunctionComponent = () => {
  const pageCssFullText = !IS_BROWSER ? getPageCssFullTextForSsr() : "";
  return h("style", { id: "resin-css-page-css-tag" }, pageCssFullText);
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
  return h("style", null, cssOutputText);
};

// deno-lint-ignore ban-types
export function createFC<T extends {}>(
  baseFC: FunctionComponent<T>,
): FunctionComponent<T & { class?: string }> {
  return (props: T & { class?: string }) => {
    const { class: className, ...baseProps } = props;
    const vdom = baseFC(baseProps as T) as JSXElement;
    return className ? addClassToVdom(vdom, className) : vdom;
  };
}

export function cx(...args: (string | null | undefined | false)[]) {
  return args.filter((a) => !!a).join(" ");
}
