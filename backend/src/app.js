process.env.TZ = "UTC";

const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

// ✅ CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://10.109.150.46:8080',
    'http://10.169.150.46:8080',
    'http://10.169.150.46:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests - FIXED
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204);
  }
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(
    `[${new Date().toLocaleTimeString()}] ${req.method} ${req.path} - Origin: ${
      req.headers.origin || "None"
    }`
  );
  next();
});
const path = require("path");

// ===================================
// MOBILE UI STATIC SERVING
// ===================================
const frontendPath = path.join(__dirname, "../../frontend/public");
const mobilePath = path.join(frontendPath, "mobile");

// ===================================
// MOBILE API CONFIG (MUST BE FIRST)
// ===================================
app.get("/mobile/api/config", (req, res) => {
  const protocol =
    req.headers["x-forwarded-proto"] ||
    (req.secure ? "https" : "http");

  const host = req.get("host");

  res.json({
    apiUrl: `${protocol}://${host}/v1`,
    socketUrl: `${protocol}://${host}`,
    environment: process.env.NODE_ENV || "production",
  });
});

// ===================================
// MOBILE STATIC FILES
// ===================================
app.use("/mobile", express.static(mobilePath));

// ===================================
// MOBILE SPA FALLBACK (EXCLUDE /api)
// ===================================
app.get('/mobile', (req, res, next) => {
  if (req.path.startsWith("/mobile/api")) {
    return next(); // 🔥 DO NOT hijack API
  }
  res.sendFile(path.join(mobilePath, "index.html"));
});



// Routes
app.use("/v1", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "DigiKhata Backend API",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: err.message,
  });
});
// ===============================
// DOCS PIPELINE TEST BLOCK
// ===============================
const docsTestMarker = {
  timestamp: new Date().toISOString(),
  message: "CI_DOCS_TEST_RUN",
};

console.log("🚀 DOCS PIPELINE TEST:", docsTestMarker);
// ===============================


module.exports = app;