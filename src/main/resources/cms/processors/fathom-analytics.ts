import type { Request, Response } from "@enonic-types/core";
import { type Csp, CspSource, csp, cspReportOnly, getSiteConfig } from "/lib/xp/portal";

const URL_FATHOM_CDN = "https://cdn.usefathom.com";
const URL_FATHOM_CDN_EU = "https://cdn-eu.usefathom.com";

// Fathom loads its script from the CDN, and reports to the same host: pageviews with an image pixel, and the
// time on page with a beacon when the visitor leaves. Each entry is a directive followed by its fallbacks.
const FATHOM_FETCH_DIRECTIVES = [
  ["script-src-elem", "script-src", "default-src"],
  ["img-src", "default-src"],
  ["connect-src", "default-src"],
];

export function responseProcessor(req: Request, res: Response): Response {
  if (req.mode !== "live") {
    return res;
  }

  const siteConfig = getSiteConfig<XP.SiteConfig>();
  const automaticallyAddToPage = siteConfig?.automaticallyAddToPage ?? true;

  if (!automaticallyAddToPage || !siteConfig?.fathomSiteKey) {
    return res;
  }

  const cdn = siteConfig.euIsolation === "standard" ? URL_FATHOM_CDN : URL_FATHOM_CDN_EU;

  const nonce = [allowFathomInCsp(csp(), cdn), allowFathomInCsp(cspReportOnly(), cdn)].filter(
    (value) => value !== undefined,
  )[0];

  const attributes = [
    `src="${cdn}/script.js"`,
    nonce !== undefined ? `nonce="${nonce}"` : undefined,
    `data-site="${escapeHtmlAttribute(siteConfig.fathomSiteKey)}"`,
    siteConfig.spa && siteConfig.spa !== "off" ? `data-spa="${siteConfig.spa}"` : undefined,
    siteConfig.honorDnt ? `data-honor-dnt="true"` : undefined,
    siteConfig.ignoreCanonical ? `data-canonical="false"` : undefined,
    "defer",
  ]
    .filter((attr) => attr !== undefined)
    .join(" ");

  if (!res.pageContributions) {
    res.pageContributions = {};
  }

  res.pageContributions.headEnd = forceArray(res.pageContributions.headEnd).concat(`<script ${attributes}></script>`);

  return res;
}

/**
 * Allows the Fathom CDN in a policy other contributors have declared, extending the directive that governs each
 * kind of request. A kind no directive covers is left alone, since declaring it would allow nothing but Fathom.
 *
 * Returns the request nonce when the script tag needs one, because 'strict-dynamic' makes the browser ignore
 * host sources.
 */
function allowFathomInCsp(policy: Csp, cdn: string): string | undefined {
  let nonce: string | undefined;

  FATHOM_FETCH_DIRECTIVES.forEach((fallbacks) => {
    const governing = fallbacks
      .map((name) => ({ name, sources: policy.directive(name) }))
      .filter((directive) => directive.sources !== null)[0];

    if (governing === undefined) {
      return;
    }

    const sources = governing.sources ?? [];
    const isScript = fallbacks[0] === "script-src-elem";
    const isStrictDynamic = isScript && sources.indexOf(CspSource.STRICT_DYNAMIC) !== -1;

    if (isStrictDynamic && governing.name === "default-src") {
      // A nonce can only be wired into a script directive, so give script elements one of their own, with the same
      // sources as default-src. The request nonce is the only nonce a policy can hold, and it is wired in below.
      const withoutNonces = sources.filter((source) => source.indexOf("'nonce-") !== 0);
      policy.add("script-src-elem", ...withoutNonces, cdn);
      nonce = policy.nonceScriptSrcElem();
      return;
    }

    if (sources.length === 1 && sources[0] === CspSource.NONE) {
      policy.override(governing.name, cdn);
    } else {
      policy.add(governing.name, cdn);
    }

    if (isStrictDynamic) {
      nonce = governing.name === "script-src-elem" ? policy.nonceScriptSrcElem() : policy.nonceScriptSrc();
    }
  });

  return nonce;
}

function forceArray<A>(data: A | A[] | undefined): A[] {
  data = data ?? [];
  return Array.isArray(data) ? data : [data];
}

function escapeHtmlAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
