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

/**
 * IMPORTANT:
 * Always resolve docs relative to THIS FILE
 * not process.cwd()
 */
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
  return data.results && data.results[0];
}


function markdownToConfluenceHtml(md) {
  return md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    .replace(/\n{2,}/g, "<br/><br/>");
}

async function createOrUpdatePage(title, body) {
  const existingPage = await getPageByTitle(title);

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

  if (existingPage) {
    payload.id = existingPage.id;
    payload.version = {
      number: existingPage.version.number + 1
    };

    await confluenceFetch(
      `${CONFLUENCE_BASE_URL}/rest/api/content/${existingPage.id}`,
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
    const filePath = path.join(docsDir, file);

    const rawContent = fs.readFileSync(filePath, "utf8");
    const htmlContent = markdownToConfluenceHtml(rawContent);

    const pageBody = `
<h2>Latest Update</h2>
<ul>
  <li><b>Commit:</b> ${GITHUB_SHA}</li>
  <li><b>Updated:</b> ${new Date().toUTCString()}</li>
</ul>
<hr/>
${htmlContent}
`;

    await createOrUpdatePage(title, pageBody);
    console.log(`✔ Updated page: ${title}`);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
