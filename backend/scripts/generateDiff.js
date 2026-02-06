const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../docs/context/diff.txt");

function run(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

try {
  const commits = run("git rev-list --max-count=2 HEAD").split("\n");

  if (commits.length < 2) {
    fs.writeFileSync(OUT, "NO_RELEVANT_CODE_CHANGES\n");
    console.log("⚠️ Only one commit found, skipping diff");
    process.exit(0);
  }

  const [after, before] = commits;

  console.log(`🟢 Diff range: ${before} → ${after}`);

  const diff = run(`git diff ${before} ${after} -- backend src frontend`);

  fs.writeFileSync(
    OUT,
    diff.length ? diff : "NO_RELEVANT_CODE_CHANGES\n"
  );

  console.log("✅ diff.txt written");
} catch (err) {
  console.error("❌ Diff generation failed");
  console.error(err.message);
  process.exit(1);
}
