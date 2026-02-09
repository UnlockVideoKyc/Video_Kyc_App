const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process"); // ✅ FIX

console.log("🟢 aiContextFromDiff.js running in CI");

const CONTEXT_DIR = path.join(__dirname, "../docs/context");
const CURRENT = path.join(CONTEXT_DIR, "current.txt");
const DIFF = path.join(CONTEXT_DIR, "diff.txt");

fs.mkdirSync(CONTEXT_DIR, { recursive: true });

// --- Get commit metadata safely ---
let commitId = "unknown";
let commitMsg = "unknown";

try {
  commitId = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  commitMsg = execSync("git log -1 --pretty=%B", { encoding: "utf8" }).trim();
} catch (e) {
  console.warn("⚠️ Unable to read git metadata");
}

// --- Read diff ---
let diffContent = "NO_RELEVANT_CODE_CHANGES";
if (fs.existsSync(DIFF)) {
  diffContent = fs.readFileSync(DIFF, "utf8").trim();
}

// --- Build context ---
const context = `
Commit ID: ${commitId}
Commit Message: ${commitMsg}

Diff:
${diffContent || "NO_RELEVANT_CODE_CHANGES"}

Documentation pipeline executed successfully.
`;

fs.writeFileSync(CURRENT, context.trim() + "\n");

console.log("✅ context/current.txt written");
console.log("🧾 Commit:", commitId);
