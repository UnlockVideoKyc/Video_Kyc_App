**Commit ID:** bb65cbc93528
**Commit Message:** Automated documentation run.

**Changes:**

### backend/scripts/aiMarkdownFromContext.js

The `aiMarkdownFromContext.js` script has been updated to improve error handling and logging. Specifically:

* The `Authorization` header now uses a consistent naming convention (camelCase).
* A new `temperature` parameter has been added to the Groq API request, set to 0.2.
* A debug log has been added to handle invalid Groq responses, which now returns a custom error message and logs the raw context.

### backend/src/app.js

A new log statement has been added to enable logging for the `AI_DOCS_TEST` environment variable. This change is likely related to testing or debugging purposes.

**No changes detected in other files.**

**Project Stack:**

* Node.js
* React
* MySQL
* AWS EC2
* PM2

**Context:**

No changes were detected in the provided context.

**Documentation:**

No meaningful changes were detected in the provided code changes. The commit message suggests an automated documentation run, but the changes do not appear to be related to documentation generation.
