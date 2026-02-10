const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // dev only
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // =========================
    // JOIN ROOM
    // =========================
    socket.on("join-room", ({ connectionId, userType }) => {
      console.log(`👥 ${userType} joined room ${connectionId}`);
      socket.join(connectionId);

      socket.to(connectionId).emit("user-joined", { userType });
    });

    // =========================
    // AGENT MESSAGE ✅ FIXED
    // =========================
    socket.on("agent-message", ({ connectionId, message }) => {
      console.log("📨 Agent message for room:", connectionId, message);

      // 🔥 THIS WAS MISSING
      socket.to(connectionId).emit("agent-message", {
        message,
        timestamp: new Date().toISOString(),
      });
    });

    // =========================
    // WEBRTC SIGNALING
    // =========================
    socket.on("offer", (data) => {
      socket.to(data.connectionId).emit("offer", data);
    });

    socket.on("answer", (data) => {
      socket.to(data.connectionId).emit("answer", data);
    });

    socket.on("ice-candidate", (data) => {
      socket.to(data.connectionId).emit("ice-candidate", data);
    });

    // =========================
    // KEEP ALIVE
    // =========================
    socket.on("ping", () => {
      socket.emit("pong");
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};

module.exports = { initSocket };
