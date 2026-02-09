const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../docs/context/diff.txt");

function cmd(c) {
  return execSync(c, { encoding: "utf8" }).trim();
}

let before;
let after = cmd("git rev-parse HEAD");

try {
  before = cmd("git rev-parse HEAD~1");
} catch {
  console.log("⚠️ No previous commit found. First run.");
  fs.writeFileSync(
    OUT,
    `INITIAL_COMMIT\n${cmd("git show --stat HEAD")}`
  );
  process.exit(0);
}

console.log(`🟢 Diff range: ${before} → ${after}`);

const diff = cmd(`git diff ${before} ${after}`);

fs.writeFileSync(
  OUT,
  diff.trim() || "NO_RELEVANT_CODE_CHANGES"
);

console.log("✅ diff.txt written");
