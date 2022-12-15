import { FunctionComponent, JSX, h } from "preact";
import {
  crc32,
  extractCssTemplate,
  extractNestedCss,
  getBaseClassNameFromCssText,
} from "./dom_styled_core.ts";

type JSXElement = JSX.Element;

const IS_BROWSER = typeof document !== "undefined";

const moduleLocalStateCommon = {
  convertedCssTextCache: {} as Record<string, string>,
};

const moduleLocalStateForSsr = {
  pageCssTexts: {} as Record<string, string>,
};

const moduleLocalStateForBrowser = {
  pageCssClassNames: undefined as Set<string> | undefined,
};

export function css(
  template: TemplateStringsArray,
  ...templateParameters: (string | number)[]
): string {
  const { convertedCssTextCache } = moduleLocalStateCommon;
  const inputCssText = extractCssTemplate(template, templateParameters);
  if (!convertedCssTextCache[inputCssText]) {
    const inputCssTextMod = inputCssText.replace(/,\r?\n/g, ",");
    const className = `cs_${crc32(inputCssTextMod)}`;
    const cssText = extractNestedCss(inputCssTextMod, `.${className}`);
    convertedCssTextCache[inputCssText] = cssText;
  }
  return convertedCssTextCache[inputCssText];
}

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

export const DomStyledCssEmitter: FunctionComponent = () => {
  const pageCssFullText =
    Object.values(moduleLocalStateForSsr.pageCssTexts).join("\n") + "\n";
  return h("style", { id: "dom-styled-page-css-tag" }, pageCssFullText);
};

function pushCssTextToEmitterForSsr(className: string, cssText: string) {
  const { pageCssTexts } = moduleLocalStateForSsr;
  if (!pageCssTexts[className]) {
    pageCssTexts[className] = cssText;
  }
}

function getDomStyledPageCssTagNode(): HTMLElement {
  const el = document.getElementById("dom-styled-page-css-tag")!;
  if (!el) {
    throw new Error(`page css tag not found for dom-styled`);
  }
  return el;
}

function pushCssTextToEmitterForBrowser(className: string, cssText: string) {
  const sb = moduleLocalStateForBrowser;
  if (!sb.pageCssClassNames) {
    sb.pageCssClassNames = new Set();
    const el = getDomStyledPageCssTagNode();
    const matches = el.innerHTML.match(/cs_[\w]{8}/g);
    if (matches) {
      for (const m of matches) {
        sb.pageCssClassNames.add(m);
      }
    }
  }
  if (!sb.pageCssClassNames.has(className)) {
    const el = getDomStyledPageCssTagNode();
    el.innerHTML += cssText;
    sb.pageCssClassNames.add(className);
  }
}

export function domStyled(vdom: JSXElement, cssText: string): JSXElement {
  const className = getBaseClassNameFromCssText(cssText);
  if (!IS_BROWSER) {
    pushCssTextToEmitterForSsr(className, cssText);
  } else {
    pushCssTextToEmitterForBrowser(className, cssText);
  }
  return addClassToVdom(vdom, className);
}

export const DomStyledGlobalStyle: FunctionComponent<{ css: string }> = ({
  css: cssText,
}) => {
  const className = getBaseClassNameFromCssText(cssText);
  const cssOutputText = cssText.replace(new RegExp(`.${className}`, "g"), "");
  return h("style", null, cssOutputText);
};

// deno-lint-ignore ban-types
export function createFC<T extends {}>(
  baseFC: FunctionComponent<T>
): FunctionComponent<T & { class?: string }> {
  return (props: T & { class?: string }) => {
    const { class: className, ...baseProps } = props;
    const vdom = baseFC(baseProps as T) as JSXElement;
    return className ? addClassToVdom(vdom, className) : vdom;
  };
}
