import { FunctionComponent, JSX, h } from "preact";
import {
  crc32,
  extractCssTemplate,
  extractNestedCss,
} from "./resin_css_core.ts";

//----------
//stateless helpers

type JSXElement = JSX.Element;

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
  mapInputCssTextToClassName: {} as Record<string, string>,
  mapClassNameToConvertedCssText: {} as Record<string, string>,
};

function getConvertedCssTextFromClassName(className: string) {
  return moduleLocalStateCommon.mapClassNameToConvertedCssText[className];
}

function translateCssDefinitionCached(inputCssText: string): string {
  const { mapInputCssTextToClassName, mapClassNameToConvertedCssText } =
    moduleLocalStateCommon;
  let className = mapInputCssTextToClassName[inputCssText];
  if (!className) {
    const inputCssTextMod = inputCssText.replace(/,\r?\n/g, ",");
    className = `cs_${crc32(inputCssTextMod)}`;
    mapInputCssTextToClassName[inputCssText] = className;
    const convertedCssText = extractNestedCss(inputCssTextMod, `.${className}`);
    mapClassNameToConvertedCssText[className] = convertedCssText;
  }
  return className;
}

//----------
//ssr

const moduleLocalStateForSsr = {
  pageCssTexts: {} as Record<string, string>,
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
    const matches = el.innerHTML.match(/cs_[\w]{8}/g);
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
  ...templateParameters: (string | number)[]
): string {
  const inputCssText = extractCssTemplate(template, templateParameters);
  return translateCssDefinitionCached(inputCssText);
}

export function solidify(vdom: JSXElement, css: string): JSXElement {
  const className = css;
  const cssText = getConvertedCssTextFromClassName(className);
  if (!IS_BROWSER) {
    pushCssTextToEmitterForSsr(className, cssText);
  } else {
    pushCssTextToEmitterForBrowser(className, cssText);
  }
  return addClassToVdom(vdom, className);
}

export const ResinCssEmitter: FunctionComponent = () => {
  const pageCssFullText = !IS_BROWSER ? getPageCssFullTextForSsr() : "";
  return h("style", { id: "resin-css-page-css-tag" }, pageCssFullText);
};

export const ResinCssGlobalStyle: FunctionComponent<{ css: string }> = ({
  css: className,
}) => {
  const cssText = getConvertedCssTextFromClassName(className);
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
