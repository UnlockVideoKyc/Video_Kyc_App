const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

const {
  CONFLUENCE_BASE_URL,
  CONFLUENCE_EMAIL,
  CONFLUENCE_API_TOKEN,
  CONFLUENCE_SPACE_KEY,
  CONFLUENCE_PARENT_PAGE_ID,
  GITHUB_SHA
} = process.env;

const docsDir = path.join(__dirname, "../docs");

const authHeader =
  "Basic " +
  Buffer.from(
    `${CONFLUENCE_EMAIL}:${CONFLUENCE_API_TOKEN}`
  ).toString("base64");

async function confluenceFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json"
    }
  });
}

async function getPageByTitle(title) {
  const res = await confluenceFetch(
    `${CONFLUENCE_BASE_URL}/rest/api/content` +
      `?title=${encodeURIComponent(title)}` +
      `&spaceKey=${CONFLUENCE_SPACE_KEY}` +
      `&expand=version`
  );
  const data = await res.json();
  return data.results?.[0];
}

async function createOrUpdatePage(title, body) {
  const existing = await getPageByTitle(title);

  const payload = {
    type: "page",
    title,
    ancestors: [{ id: CONFLUENCE_PARENT_PAGE_ID }],
    space: { key: CONFLUENCE_SPACE_KEY },
    body: {
      storage: {
        value: body,
        representation: "storage"
      }
    }
  };

  if (existing) {
    payload.id = existing.id;
    payload.version = { number: existing.version.number + 1 };

    await confluenceFetch(
      `${CONFLUENCE_BASE_URL}/rest/api/content/${existing.id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload)
      }
    );
  } else {
    await confluenceFetch(
      `${CONFLUENCE_BASE_URL}/rest/api/content`,
      {
        method: "POST",
        body: JSON.stringify(payload)
      }
    );
  }
}

async function run() {
  const files = fs.readdirSync(docsDir);

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const title = file.replace(".md", "");
    const md = fs.readFileSync(path.join(docsDir, file), "utf8");

    const html = marked.parse(md);

    const pageBody = `
<h2>Latest Update</h2>
<ul>
  <li><b>Commit:</b> ${GITHUB_SHA}</li>
  <li><b>Updated:</b> ${new Date().toUTCString()}</li>
</ul>
<hr/>
${html}
`;

    await createOrUpdatePage(title, pageBody);
    console.log(`✔ Updated: ${title}`);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
