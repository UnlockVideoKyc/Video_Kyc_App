process.env.TZ = "UTC";

const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false); // ❗ DO NOT throw error
    },
    credentials: true,
  })
);


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

// Routes
app.use("/v1", routes);

// Health check
app.get("/", (req, res) => {
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

module.exports = app;