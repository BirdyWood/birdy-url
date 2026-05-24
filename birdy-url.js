const BRAND_ALIASES = {
  github: "GitHub",
  openai: "OpenAI",
  youtube: "YouTube",
  supabase: "Supabase",
  vercel: "Vercel",
  nextjs: "Next.js",
  discord: "Discord",
  whatsapp: "WhatsApp",
  linkedin: "LinkedIn",
  firefox: "Firefox",
  cloudflare: "Cloudflare",
  figma: "Figma",
  stripe: "Stripe",
  birdywood: "Birdywood",
  shopify: "Shopify",
  notion: "Notion",
  airtable: "Airtable",
  twitch: "Twitch",
  heroku: "Heroku",
  netlify: "Netlify",
  gitlab: "GitLab",
  bitbucket: "Bitbucket",
  jira: "Jira",
  slack: "Slack",
  hubspot: "HubSpot",
  salesforce: "Salesforce",
  intercom: "Intercom",
  typeform: "Typeform",
  postman: "Postman",
  sentry: "Sentry",
  datadog: "Datadog",
  grafana: "Grafana",
  tailwindcss: "Tailwind CSS",
  vite: "Vite",
  svelte: "Svelte",
  nuxtjs: "Nuxt.js",
  mongodb: "MongoDB",
  firebase: "Firebase",
  amazonaws: "AWS",
  googleapis: "Google",
  microsoft: "Microsoft",
  apple: "Apple",
  bbc: "BBC",
  google: "Google"
};

const SUBDOMAIN_ALIASES = {
  "api-docs": "Docs",
};

const IGNORED_SUBDOMAINS = new Set([
  "www", "m", "mobile",
  "cdn", "static", "assets", "asset", "img", "image", "images", "media",
  "api", "edge", "cache", "internal", "origin", "proxy", "gateway",
  "lb", "ns", "ns1", "ns2",
  "smtp", "pop", "imap", "ftp", "sftp",
  "vpn", "remote", "web", "ssl", "secure",
  "auth", "sso", "login", "oauth"
]);

const REGION_PATTERN = /^(us|eu|ap|sa|af|me)(-[a-z0-9]+)*$/;

// Common multi-part TLDs — when the last two parts match one of these,
// the real domain sits one position further left (e.g. bbc.co.uk → domain=bbc).
const MULTI_PART_TLDS = new Set([
  "com.au", "net.au", "org.au", "edu.au", "gov.au",
  "co.uk",  "org.uk", "gov.uk", "ac.uk",  "me.uk",
  "co.jp",  "ne.jp",  "or.jp",  "ac.jp",
  "co.kr",  "or.kr",
  "co.in",  "net.in", "org.in",
  "com.br", "net.br", "org.br",
  "com.mx", "org.mx",
  "com.cn", "net.cn", "org.cn",
  "com.hk", "org.hk",
  "com.sg", "org.sg",
  "com.tw", "org.tw",
  "co.nz",  "org.nz",
  "co.za",  "co.id",
  "com.ar", "com.tr", "com.sa", "com.pl", "com.ua",
  "com.co", "com.cl", "com.pe", "com.my", "com.pk",
  "gouv.fr", "gov.fr",
]);

function humanizeUrl(url) {
  try {
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const hostname = new URL(normalized).hostname.toLowerCase();

    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return { displayName: "Website", verified: false };

    const parts = hostname.split(".");
    const tldSize = MULTI_PART_TLDS.has(parts.slice(-2).join(".")) ? 3 : 2;

    const domain = parts.at(-tldSize) || "";
    const rawSubdomains = parts.slice(0, -tldSize);

    const subdomains = rawSubdomains.filter(sub =>
      !IGNORED_SUBDOMAINS.has(sub) &&
      !REGION_PATTERN.test(sub) &&
      sub.length > 1 &&
      !/^\d+$/.test(sub)
    );

    const displayName = [domain, ...(subdomains).reverse()]
      .map(formatToken)
      .filter(Boolean)
      .join(" ") || "Website";

    return { displayName, verified: !!BRAND_ALIASES[domain] };
  } catch {
    return { displayName: "Website", verified: false };
  }
}

function formatToken(token) {
  if (!token) return "";
  if (BRAND_ALIASES[token]) return BRAND_ALIASES[token];
  if (SUBDOMAIN_ALIASES[token]) return SUBDOMAIN_ALIASES[token];
  return token
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

module.exports = {
  humanizeUrl
}