const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

// Enable CORS for all origins (development only)
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path} - Origin: ${req.headers.origin || 'None'}`);
  next();
});

// Routes
app.use("/api", routes);

// Health check
app.get("/", (req, res) => {
  res.json({ 
    success: true,
    message: "DigiKhata Backend API",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: err.message
  });
});

module.exports = app;