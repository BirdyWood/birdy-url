// node test.js

import { humanizeUrl } from "./birdy-url.js";

let passed = 0, failed = 0;

function test(label, url, expected) {
    const result = humanizeUrl(url);
    const ok = result.displayName === expected.displayName &&
        (expected.verified === undefined || result.verified === expected.verified);
    console.log(`${ok ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m"} ${label}`);
    if (!ok) console.log(`    expected : ${JSON.stringify(expected)}\n    got      : ${JSON.stringify(result)}`);
    ok ? passed++ : failed++;
}

function section(title) {
    console.log(`\n── ${title} ${"─".repeat(50 - title.length)}`);
}

section("Brand aliases");
test("Stripe", "https://stripe.com", { displayName: "Stripe", verified: true });
test("GitHub", "https://github.com", { displayName: "GitHub", verified: true });
test("YouTube", "https://youtube.com", { displayName: "YouTube", verified: true });
test("Cloudflare", "https://cloudflare.com", { displayName: "Cloudflare", verified: true });
test("Figma", "https://figma.com", { displayName: "Figma", verified: true });
test("HubSpot", "https://hubspot.com", { displayName: "HubSpot", verified: true });

section("Ignored subdomains stripped");
test("www", "https://www.github.com", { displayName: "GitHub", verified: true });
test("cdn", "https://cdn.shopify.com", { displayName: "Shopify", verified: true });
test("api", "https://api.stripe.com", { displayName: "Stripe", verified: true });
test("static", "https://static.figma.com", { displayName: "Figma", verified: true });
test("m", "https://m.youtube.com", { displayName: "YouTube", verified: true });
test("assets", "https://assets.notion.so", { displayName: "Notion", verified: true });
test("multiple noise subs", "https://cdn.api.github.com", { displayName: "GitHub", verified: true });
test("www BirdyWood", "https://www.birdywood.fr", { displayName: "Birdywood", verified: true });

section("Meaningful subdomains shown");
test("Dashboard", "https://dashboard.stripe.com", { displayName: "Stripe Dashboard", verified: true });
test("Docs", "https://docs.github.com", { displayName: "GitHub Docs", verified: true });
test("Blog", "https://blog.cloudflare.com", { displayName: "Cloudflare Blog", verified: true });
test("Status", "https://status.github.com", { displayName: "GitHub Status", verified: true });
test("Labs", "https://labs.birdywood.fr", { displayName: "Birdywood Labs", verified: true });
test("App", "https://app.discord.com", { displayName: "Discord App", verified: true });
test("Console", "https://console.firebase.google.com", { displayName: "Google Firebase Console", verified: true });
test("Sandbox", "https://sandbox.stripe.com", { displayName: "Stripe Sandbox", verified: true });
test("Staging", "https://staging.intercom.com", { displayName: "Intercom Staging", verified: true });
test("Help", "https://help.notion.so", { displayName: "Notion Help", verified: true });
test("Academy", "https://academy.hubspot.com", { displayName: "HubSpot Academy", verified: true });
test("api-docs alias", "https://api-docs.vercel.com", { displayName: "Vercel Docs", verified: true });

section("All subdomains shown (no cap)");
test("Blog + brand", "https://blog.docs.github.com", { displayName: "GitHub Docs Blog", verified: true });


section("Multi-part TLDs");
test(".co.uk", "https://bbc.co.uk", { displayName: "BBC", verified: true });
test(".co.uk sub", "https://news.bbc.co.uk", { displayName: "BBC News", verified: true });
test(".com.au", "https://shop.domain.com.au", { displayName: "Domain Shop", verified: false });
test(".co.jp", "https://rakuten.co.jp", { displayName: "Rakuten", verified: false });
test(".com.br", "https://mercadolibre.com.br", { displayName: "Mercadolibre", verified: false });
test(".com.sg", "https://app.grab.com.sg", { displayName: "Grab App", verified: false });
test(".gouv.fr", "https://impots.gouv.fr", { displayName: "Impots", verified: false });
test(".co.kr", "https://naver.co.kr", { displayName: "Naver", verified: false });
section("Region codes stripped");
test("us region", "https://us.api.stripe.com", { displayName: "Stripe", verified: true });
test("eu region", "https://eu.slack.com", { displayName: "Slack", verified: true });
test("ap region", "https://ap-southeast.cdn.github.com", { displayName: "GitHub", verified: true });

section("Generic domains");
test("Unknown brand", "https://mycoolstartup.io", { displayName: "Mycoolstartup", verified: false });
test("Hyphenated domain", "https://my-cool-app.com", { displayName: "My Cool App", verified: false });
test("Hyphenated subdomain", "https://my-section.myapp.com", { displayName: "Myapp My Section", verified: false });
test("Subdomain + unknown", "https://docs.myapp.dev", { displayName: "Myapp Docs", verified: false });

section("Edge cases");
test("No scheme", "labs.birdywood.fr", { displayName: "Birdywood Labs", verified: true });
test("Trailing slash", "https://github.com/", { displayName: "GitHub", verified: true });
test("With path", "https://dashboard.stripe.com/invoices/123", { displayName: "Stripe Dashboard", verified: true });
test("With query string", "https://blog.cloudflare.com?ref=hn", { displayName: "Cloudflare Blog", verified: true });
test("IP address", "https://192.168.1.1", { displayName: "Website", verified: false });
test("Garbage input", "not-a-url!!!", { displayName: "Website", verified: false });
test("Empty string", "", { displayName: "Website", verified: false });

console.log(`\n${"─".repeat(54)}`);
console.log(`  ${passed}/${passed + failed} passed  ${failed > 0 ? `\x1b[31m(${failed} failed)\x1b[0m` : "\x1b[32m✓ all good\x1b[0m"}`);
console.log(`${"─".repeat(54)}\n`);
if (failed > 0) process.exit(1);