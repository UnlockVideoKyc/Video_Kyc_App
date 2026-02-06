module.exports = function getCommitInfo() {
  return {
    id: process.env.GITHUB_SHA || "local-dev",
    branch: process.env.GITHUB_REF_NAME || "local",
    actor: process.env.GITHUB_ACTOR || "unknown",
  };
};
