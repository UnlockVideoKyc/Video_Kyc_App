const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIFF_PATH = path.join(ROOT, "docs/context/diff.txt");

fs.mkdirSync(path.dirname(DIFF_PATH), { recursive: true });

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
    diff = execSync(
      "git diff HEAD~1 HEAD -- backend frontend",
      { encoding: "utf8" }
    ).trim();
  } else {
    diff = execSync(
      "git show HEAD --pretty=format:%B",
      { encoding: "utf8" }
    ).trim();

    diff =
      "FIRST COMMIT OR NO PREVIOUS REVISION\n\n" + diff;
  }
} catch (err) {
  console.error("❌ Diff generation failed");
  process.exit(1);
}

if (!diff) {
  diff = "NO_RELEVANT_CODE_CHANGES";
}

fs.writeFileSync(DIFF_PATH, diff + "\n");
console.log("✅ Diff written safely");
