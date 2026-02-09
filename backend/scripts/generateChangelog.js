const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CONTEXT_PATH = path.join(ROOT, "docs/context/current.txt");
const CHANGELOG_DIR = path.join(ROOT, "docs/changelog");

if (!fs.existsSync(CONTEXT_PATH)) {
  console.error("❌ No context found");
  process.exit(1);
}

const context = fs.readFileSync(CONTEXT_PATH, "utf8");

const commitLine = context.split("\n").find(l => l.startsWith("Commit ID:"));
const commitId = commitLine ? commitLine.split(":")[1].trim() : "unknown";

fs.mkdirSync(CHANGELOG_DIR, { recursive: true });

const md = `
# Changelog – ${commitId}

${context}

Generated automatically by CI/CD
`.trim();

fs.writeFileSync(
  path.join(CHANGELOG_DIR, `${commitId}.md`),
  md
);

console.log("✅ Changelog written");
