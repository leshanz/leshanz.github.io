import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const profileId = process.env.GOOGLE_SCHOLAR_ID ?? "IcP_P_sAAAAJ";
const dataUrl = new URL("../src/data/publications.json", import.meta.url);
const overridesUrl = new URL("../src/data/publication-overrides.json", import.meta.url);
const scholarBase = "https://scholar.google.com";
const scholarUrl = `${scholarBase}/citations?user=${profileId}&hl=en&pagesize=100`;

function decodeHtml(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function textFromHtml(value) {
  return decodeHtml(
    value
      .replace(/<svg[^>]*aria-label="([^"]+)"[^>]*>[\s\S]*?<\/svg>/gi, "$1")
      .replace(/<[^>]+>/g, " "),
  ).replace(/\s+/g, " ").trim();
}

function normalizeTitle(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function titleSimilarity(left, right) {
  const a = new Set(normalizeTitle(left).split(" "));
  const b = new Set(normalizeTitle(right).split(" "));
  const intersection = [...a].filter((word) => b.has(word)).length;
  return intersection / Math.max(a.size, b.size, 1);
}

function parseScholar(html) {
  const rows = [...html.matchAll(/<tr class="gsc_a_tr">([\s\S]*?)<\/tr>/g)];

  return rows.map(([, row]) => {
    const titleMatch = row.match(/<a([^>]*)class="gsc_a_at"([^>]*)>([\s\S]*?)<\/a>/);
    const grayFields = [...row.matchAll(/<div class="gs_gray">([\s\S]*?)<\/div>/g)];
    const year = Number(textFromHtml(row.match(/<span class="gsc_a_h gsc_a_hc gs_ibl">([\s\S]*?)<\/span>/)?.[1] ?? "0"));
    const citations = Number(textFromHtml(row.match(/class="gsc_a_ac gs_ibl">([\s\S]*?)<\/a>/)?.[1] ?? "0")) || 0;
    const attributes = `${titleMatch?.[1] ?? ""}${titleMatch?.[2] ?? ""}`;
    const href = decodeHtml(attributes.match(/href="([^"]+)"/)?.[1] ?? "");
    const titleHtml = titleMatch?.[3] ?? "";
    const citationId = href.match(/citation_for_view=[^:&]+:([^&]+)/)?.[1] ?? normalizeTitle(textFromHtml(titleHtml)).replaceAll(" ", "-");
    let venue = textFromHtml(grayFields[1]?.[1] ?? "");

    if (year) {
      venue = venue.replace(new RegExp(`,\\s*${year}\\s*$`), "").trim();
    }

    return {
      id: citationId,
      title: textFromHtml(titleHtml),
      authors: textFromHtml(grayFields[0]?.[1] ?? "").replace(/,\s*(?:\.{3}|…)\s*$/, ", et al."),
      venue,
      year,
      citations,
      scholarUrl: `${scholarBase}${href}`,
    };
  }).filter((publication) => publication.title && publication.year);
}

async function crossrefMetadata(publication) {
  const query = new URLSearchParams({
    "query.title": publication.title,
    rows: "3",
    select: "DOI,title,container-title,published,published-print,published-online,URL,type,volume,issue,page",
    mailto: "lzhao53@jhu.edu",
  });
  const response = await fetch(`https://api.crossref.org/works?${query}`, {
    headers: { "User-Agent": "leshanz-personal-site/1.0 (mailto:lzhao53@jhu.edu)" },
  });

  if (!response.ok) return {};
  const items = (await response.json()).message?.items ?? [];
  const match = items
    .map((item) => ({ item, score: titleSimilarity(publication.title, item.title?.[0] ?? "") }))
    .filter(({ item, score }) => {
      const date = item.published?.["date-parts"]?.[0]
        ?? item["published-print"]?.["date-parts"]?.[0]
        ?? item["published-online"]?.["date-parts"]?.[0];
      return score >= 0.82 && (!date?.[0] || Math.abs(date[0] - publication.year) <= 1);
    })
    .sort((a, b) => b.score - a.score)[0]?.item;

  if (!match) return {};
  return {
    doi: match.DOI,
    journalUrl: match.URL,
    venue: publication.venue || match["container-title"]?.[0] || "",
  };
}

async function main() {
  const response = await fetch(scholarUrl, {
    headers: {
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "Mozilla/5.0",
    },
  });
  if (!response.ok) throw new Error(`Google Scholar returned ${response.status}`);

  let html = await response.text();
  let fetched = parseScholar(html);
  if (!fetched.length) {
    html = execFileSync(
      "curl",
      ["-fsSL", "--max-time", "30", "-A", "Mozilla/5.0", scholarUrl],
      { encoding: "utf8", maxBuffer: 5 * 1024 * 1024 },
    );
    fetched = parseScholar(html);
  }
  if (!fetched.length) throw new Error("No publications were found; the Scholar markup may have changed.");

  let existing = { source: {}, publications: [] };
  try {
    existing = JSON.parse(await readFile(dataUrl, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const existingById = new Map(existing.publications.map((item) => [item.id, item]));
  const overrides = JSON.parse(await readFile(overridesUrl, "utf8"));

  const enriched = [];
  for (const publication of fetched) {
    const previous = existingById.get(publication.id) ?? {};
    let crossref = {};
    try {
      crossref = await crossrefMetadata(publication);
    } catch {
      // Scholar data remains usable when Crossref is temporarily unavailable.
    }
    const merged = { ...previous, ...publication, ...crossref, ...(overrides[publication.id] ?? {}) };
    delete merged.preprintUrl;
    enriched.push(merged);
  }

  enriched.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  const output = {
    source: {
      provider: "Google Scholar",
      profileId,
      profileUrl: scholarUrl,
      updatedAt: new Date().toISOString(),
    },
    publications: enriched,
  };

  await writeFile(fileURLToPath(dataUrl), `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Updated ${enriched.length} publications from Google Scholar.`);
}

await main();
