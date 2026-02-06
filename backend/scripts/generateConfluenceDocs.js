const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

const BASE = process.env.CONFLUENCE_BASE_URL;
const SPACE = process.env.CONFLUENCE_SPACE_KEY;
const EMAIL = process.env.CONFLUENCE_EMAIL;
const TOKEN = process.env.CONFLUENCE_API_TOKEN;


const DOCS_DIR = path.join(__dirname, "../docs/current");

const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith(".md"));

if (files.length === 0) {
  console.error("❌ No markdown files found. Aborting Confluence publish.");
  process.exit(1);
}

for (const file of files) {
  const content = fs.readFileSync(path.join(DOCS_DIR, file), "utf8").trim();

  if (!content || content.length < 50) {
    console.error(`❌ ${file} is empty or invalid. Aborting publish.`);
    process.exit(1);
  }
}
const AUTH = Buffer.from(`${EMAIL}:${TOKEN}`).toString("base64");

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Basic ${AUTH}`,
      Accept: "application/json",
      ...(options.headers || {})
    }
  });

  const text = await res.text();
  if (text.startsWith("<")) {
    throw new Error("HTML returned from Confluence (bad base URL or auth)");
  }

  return JSON.parse(text);
}

async function upsertPage(title, markdown) {
  const searchUrl =
    `${BASE}/rest/api/content?spaceKey=${SPACE}&title=${encodeURIComponent(
      title
    )}&expand=version`;

  const data = await fetchJson(searchUrl);
  const page = data.results[0];

  const htmlBody = marked.parse(markdown);

  const payload = {
    id: page.id,
    type: "page",
    title,
    version: { number: page.version.number + 1 },
    body: {
      storage: {
        value: htmlBody,
        representation: "storage"
      }
    }
  };

  await fetch(`${BASE}/rest/api/content/${page.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${AUTH}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  console.log(`✅ Updated: ${title}`);
}

async function run() {
  const docsDir = path.join(__dirname, "../docs/current");
  const files = fs.readdirSync(docsDir);

  for (const file of files) {
    const title = file.replace(".md", "");
    const content = fs.readFileSync(path.join(docsDir, file), "utf8");
    await upsertPage(title, content);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
// backend/scripts/generateConfluenceDocs.js
// CI_TEST_CHANGE
