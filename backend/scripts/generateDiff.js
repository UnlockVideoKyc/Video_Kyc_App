const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const DIFF_FILE = path.join(__dirname, "../docs/context/diff.txt");

function run() {
  try {
    const diff = execSync(
      "git diff HEAD~1 HEAD -- backend frontend",
      { encoding: "utf-8" }
    );

    if (!diff.trim()) {
      fs.writeFileSync(
        DIFF_FILE,
        "NO_RELEVANT_CODE_CHANGES\n"
      );
      console.log("ℹ️ No relevant code changes");
      return;
    }

    fs.writeFileSync(DIFF_FILE, diff);
    console.log("✅ Diff written");
  } catch (e) {
    console.error("❌ Diff generation failed");
    process.exit(1);
  }
}

run();
