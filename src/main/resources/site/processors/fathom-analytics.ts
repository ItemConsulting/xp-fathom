import { getSite } from "/lib/xp/portal";
import { forceArray } from "../../lib/array";
import { type SiteConfig } from "../site-config";

const URL_FATHOM_PRECONNECT = "https://cdn.usefathom.com";
const URL_FATHOM_SCRIPT = "https://cdn.usefathom.com/script.js";

export function responseProcessor(
  req: XP.Request,
  res: XP.Response
): XP.Response {
  const siteConfig = getCurrentSiteConfig();

  if (req.mode !== "live" && !siteConfig) {
    return res;
  }

  if (!res.pageContributions) {
    res.pageContributions = {};
  }

  // Pre connect to fathom cdn
  res.pageContributions.headBegin = forceArray(
    res.pageContributions.headBegin
  ).concat(`<link rel="preconnect" href="${URL_FATHOM_PRECONNECT}">`)

  const attributes = [
    siteConfig.spa !== "auto" ? `data-spa="${siteConfig.spa}"` : undefined,
    siteConfig.honorDnt ? `data-honor-dnt="true"` : undefined,
    siteConfig.ignoreCanonical ? `data-canonical="false"` : undefined,
  ]
    .filter((attr) => attr !== undefined)
    .join(" ");

  res.pageContributions.headEnd = forceArray(
    res.pageContributions.headEnd
  ).concat(
    `<script src="${URL_FATHOM_SCRIPT}" data-site="${siteConfig.fathomSiteKey}" ${attributes} defer></script>`
  );

  return res;
}

function getCurrentSiteConfig(): SiteConfig {
  const site = getSite<SiteConfig>();

  const results = forceArray(site.data.siteConfig)
    .filter((siteConfig) => siteConfig.applicationKey === app.name)
    .map((siteConfig) => siteConfig.config);

  return results[0];
}
