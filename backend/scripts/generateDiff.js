const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIFF_PATH = path.join(ROOT, "docs/context/diff.txt");
console.log("🟢 generateDiff.js running in CI");


// ensure folder exists
fs.mkdirSync(path.dirname(DIFF_PATH), { recursive: true });

// helper: check if previous commit exists
function hasPreviousCommit() {
  try {
    execSync("git rev-parse HEAD~1", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

let diff = "";

try {
  if (hasPreviousCommit()) {
    // ✅ ONLY PRODUCT CODE (IMPORTANT)
    diff = execSync(
      "git diff HEAD~1 HEAD -- backend/src frontend/src",
      { encoding: "utf8" }
    ).trim();
  } else {
    // first commit / shallow clone
    diff = execSync(
      "git show HEAD -- backend/src frontend/src",
      { encoding: "utf8" }
    ).trim();
  }
} catch (err) {
  console.error("❌ Diff generation failed");
  process.exit(1);
}

// fallback if nothing changed
if (!diff) {
  diff = "NO_RELEVANT_CODE_CHANGES";
}

// write diff
fs.writeFileSync(DIFF_PATH, diff + "\n");

console.log("✅ Diff generated");
