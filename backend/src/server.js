process.env.TZ = "UTC";

require("dotenv").config();
const http = require("http");
const app = require("./app");                 // ✅ import express app
const { initSocket } = require("./config/socket"); // ✅ single socket entry

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// Create HTTP server
const server = http.createServer(app);

// ✅ Initialize Socket.IO ONCE
initSocket(server);

// ===================================
// START SERVER
// ===================================
server.listen(PORT, HOST, () => {
  console.log("\n========================================");
  console.log("🚀 DigiKhata Video KYC Server Started");
  console.log("========================================");
  console.log(`🌍 Host: ${HOST}`);
  console.log(`🔗 Port: ${PORT}`);
  console.log(`📱 Mobile App: http://localhost:${PORT}/mobile`);
  console.log(`🔗 API: http://localhost:${PORT}/v1`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`📡 Socket.IO: http://localhost:${PORT}`);
  console.log("========================================\n");
});

// ===================================
// GRACEFUL SHUTDOWN
// ===================================
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\nSIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

module.exports = server;
