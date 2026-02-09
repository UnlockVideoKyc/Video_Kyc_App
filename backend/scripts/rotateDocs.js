const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CURRENT = path.join(ROOT, "docs/current");
const HISTORY = path.join(ROOT, "docs/history");
const CONTEXT_CUR = path.join(ROOT, "docs/context/current.txt");
const CONTEXT_HIST = path.join(ROOT, "docs/context/history");

const ts = new Date().toISOString().replace(/[:.]/g, "-");

fs.mkdirSync(HISTORY, { recursive: true });
fs.mkdirSync(CONTEXT_HIST, { recursive: true });

// archive markdown
if (fs.existsSync(CURRENT)) {
  fs.readdirSync(CURRENT).forEach((f) => {
    fs.copyFileSync(
      path.join(CURRENT, f),
      path.join(HISTORY, `${ts}_${f}`)
    );
  });
}

// archive context
if (fs.existsSync(CONTEXT_CUR)) {
  fs.copyFileSync(
    CONTEXT_CUR,
    path.join(CONTEXT_HIST, `${ts}_context.txt`)
  );
}

console.log("✅ Docs + context archived");
