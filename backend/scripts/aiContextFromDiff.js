const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DIFF_PATH = path.join(__dirname, "../docs/context/diff.txt");
const CONTEXT_PATH = path.join(__dirname, "../docs/context/current.txt");
console.log("🟢 aiContextFromDiff.js running in CI");


const commitSha =
  process.env.GITHUB_SHA ||
  crypto.randomBytes(6).toString("hex");

const diff = fs.existsSync(DIFF_PATH)
  ? fs.readFileSync(DIFF_PATH, "utf8")
  : "";

let context = `
Commit ID: ${commitSha}

Commit Message:
Automated documentation run.

`;

if (!diff || diff.includes("NO_RELEVANT_CODE_CHANGES")) {
  context += `
No relevant product code changes detected.

This commit was still evaluated by the documentation pipeline.
`;
} else {
  context += `
Code changes detected:

${diff}
`;
}

fs.writeFileSync(CONTEXT_PATH, context.trim() + "\n");
console.log("✅ context/current.txt written with commit metadata");
