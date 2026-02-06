const fs = require("fs");
const path = require("path");

const CONTEXT_PATH = path.join(__dirname, "../docs/context/current.txt");
const OUTPUT_DIR = path.join(__dirname, "../docs/current");

if (!fs.existsSync(CONTEXT_PATH)) {
  throw new Error("❌ context/current.txt not found");
}

const context = fs.readFileSync(CONTEXT_PATH, "utf8").trim();

if (!context) {
  throw new Error("❌ context/current.txt is empty");
}

async function callGroq(prompt) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a senior software architect generating concise, clear technical documentation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2
    })
  });

  const json = await res.json();

  if (!json.choices || !json.choices[0]) {
    console.error("⚠️ Groq returned invalid response:");
    console.error(JSON.stringify(json, null, 2));
    throw new Error("Groq AI failed");
  }

  return json.choices[0].message.content;
}

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const sections = ["overview", "backend", "frontend", "database", "deployment"];

  for (const section of sections) {
    let markdown;

    try {
      markdown = await callGroq(`
Generate ${section} documentation from the following commit context.

Context:
${context}

Tech stack:
- Node.js
- React
- MySQL
- AWS EC2
- PM2

Include the commit ID and clearly explain what changed.
If nothing changed for this section, say so explicitly.
`);
    } catch (err) {
      console.error(`⚠️ AI failed for ${section}, using fallback`);

      const commitMatch = context.match(/Commit ID:\s*(.*)/);
      const commitId = commitMatch ? commitMatch[1] : "unknown";

      markdown = `
# ${section}

**Commit:** ${commitId}

⚠️ AI generation failed for this section.

This page confirms the documentation pipeline executed successfully.
`;
    }

    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${section}.md`),
      markdown.trim() + "\n"
    );

    console.log(`✅ docs/current/${section}.md written`);
  }
})();
// backend/scripts/aiMarkdownFromContext.js
// comment only