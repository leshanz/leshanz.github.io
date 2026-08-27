import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  const contents = await readFile(path.join(projectRoot, relativePath), "utf8");
  return JSON.parse(contents);
}

function validateRecords(records, collectionName, requiredFields) {
  if (!Array.isArray(records)) {
    throw new Error(`${collectionName} must be an array.`);
  }

  const ids = new Set();
  for (const [index, record] of records.entries()) {
    for (const field of requiredFields) {
      if (record[field] === undefined || record[field] === null || record[field] === "") {
        throw new Error(`${collectionName}[${index}] is missing required field "${field}".`);
      }
    }

    if (ids.has(record.id)) {
      throw new Error(`${collectionName} contains duplicate id "${record.id}".`);
    }
    ids.add(record.id);
  }
}

function validateUrls(records, collectionName, fields) {
  for (const [index, record] of records.entries()) {
    for (const field of fields) {
      if (!record[field]) continue;

      try {
        const url = new URL(record[field]);
        if (!url.protocol.startsWith("http")) throw new Error();
      } catch {
        throw new Error(`${collectionName}[${index}].${field} must be an HTTP(S) URL.`);
      }
    }
  }
}

function isValidIsoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

async function validateLocalAssets() {
  const source = await readFile(path.join(projectRoot, "src/main.tsx"), "utf8");
  const assetPattern = /["'](\/[^"'?#]+\.(?:gif|jpe?g|pdf|png|svg|webp))["']/gi;
  const assets = new Set([...source.matchAll(assetPattern)].map((match) => match[1]));

  for (const asset of assets) {
    await access(path.join(projectRoot, "public", asset.slice(1)));
  }

  return assets.size;
}

async function main() {
  const publicationData = await readJson("src/data/publications.json");
  const talkData = await readJson("src/data/talks.json");
  const publications = publicationData.publications;
  const talks = talkData.talks;

  validateRecords(publications, "publications", ["id", "title", "authors", "year", "scholarUrl"]);
  validateRecords(talks, "talks", ["id", "title", "event", "date"]);
  validateUrls(publications, "publications", ["scholarUrl", "journalUrl"]);
  validateUrls(talks, "talks", ["url", "slidesUrl"]);

  for (const [index, publication] of publications.entries()) {
    if (!Number.isInteger(publication.year)) {
      throw new Error(`publications[${index}].year must be an integer.`);
    }
    if (index > 0 && publication.year > publications[index - 1].year) {
      throw new Error("publications must be ordered from newest to oldest.");
    }
    if (/(?:\.{3}|…)/.test(publication.authors)) {
      throw new Error(`publications[${index}].authors must use "et al." instead of an ellipsis.`);
    }
    if ("preprintUrl" in publication || /(?:^|\.)arxiv\.org$/i.test(new URL(publication.journalUrl ?? publication.scholarUrl).hostname)) {
      throw new Error(`publications[${index}] contains a preprint URL.`);
    }
  }

  for (const [index, talk] of talks.entries()) {
    if (!isValidIsoDate(talk.date)) {
      throw new Error(`talks[${index}].date must be a valid ISO YYYY-MM-DD date.`);
    }
  }

  const assetCount = await validateLocalAssets();
  console.log(`Validated ${publications.length} publications, ${talks.length} talks, and ${assetCount} local assets.`);
}

main().catch((error) => {
  console.error(`Content validation failed: ${error.message}`);
  process.exitCode = 1;
});
