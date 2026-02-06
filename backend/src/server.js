// backend/src/server.js
// second test change for ai diffff


require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";


const server = app.listen(PORT, HOST, () => {
  console.log(`\n=======================================`);
  console.log(`🚀 Server is running`);
  console.log(`📍 Host: ${HOST}`);
  console.log(`🔗 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`=======================================\n`);
  

});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
// TEMP CHANGE FOR DOC TEST
app.post("/kyc/start", async (req, res) => {
  res.json({ status: "KYC session started" });
});
console.log("new behavior");

// backend/src/server.js
// pipeline test change
// test: added health check log

// docs pipeline test – backend startup
// backend/src/controllers/kycController.js
// DOCS_PIPELINE_TEST_CHANGE

// DOCS_PIPELINE_TEST: context generation script