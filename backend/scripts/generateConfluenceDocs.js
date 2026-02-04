const fs = require("fs");
const path = require("path");



const {
  CONFLUENCE_BASE_URL,
  CONFLUENCE_EMAIL,
  CONFLUENCE_API_TOKEN,
  CONFLUENCE_SPACE_KEY,
  CONFLUENCE_PARENT_PAGE_ID,
  GITHUB_SHA
} = process.env;

const docsDir = path.join(process.cwd(), "docs");

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
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
}

async function getPageByTitle(title) {
  const res = await confluenceFetch(
    `${CONFLUENCE_BASE_URL}/rest/api/content?title=${encodeURIComponent(
      title
    )}&spaceKey=${CONFLUENCE_SPACE_KEY}`
  );
  const data = await res.json();
  return data.results && data.results[0];
}

async function createOrUpdatePage(title, body) {
  const page = await getPageByTitle(title);

  if (page) {
    await confluenceFetch(
      `${CONFLUENCE_BASE_URL}/rest/api/content/${page.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          id: page.id,
          type: "page",
          title,
          version: {
            number: page.version.number + 1
          },
          body: {
            storage: {
              value: body,
              representation: "storage"
            }
          }
        })
      }
    );
  } else {
    await confluenceFetch(
      `${CONFLUENCE_BASE_URL}/rest/api/content`,
      {
        method: "POST",
        body: JSON.stringify({
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
        })
      }
    );
  }
}

async function run() {
  if (!fs.existsSync(docsDir)) {
    throw new Error("❌ docs/ folder not found in backend/");
  }

  const files = fs.readdirSync(docsDir);

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const title = file.replace(".md", "");
    const content = fs.readFileSync(
      path.join(docsDir, file),
      "utf8"
    );

    const pageBody = `
<h2>Latest Update</h2>
<ul>
  <li><b>Commit:</b> ${GITHUB_SHA || "local-run"}</li>
  <li><b>Updated:</b> ${new Date().toUTCString()}</li>
</ul>
<hr/>
<pre>${content}</pre>
`;

    await createOrUpdatePage(title, pageBody);
    console.log(`✔ Synced: ${title}`);
  }
}

run().catch(err => {
  console.error(err.message);
  process.exit(1);
});


