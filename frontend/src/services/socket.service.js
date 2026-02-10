import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL.replace("/v1", "");

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.joinedRoom = null;
    this.connecting = false;
  }

  async connect() {
    if (this.connected) {
      console.log("♻️ Agent socket already connected");
      return;
    }

    if (this.connecting) return;

    this.connecting = true;

    return new Promise((resolve, reject) => {
      this.socket = io(SOCKET_URL, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        auth: {
          token: localStorage.getItem("token"),
        },
      });

      this.socket.once("connect", () => {
        console.log("✅ Agent socket connected:", this.socket.id);
        this.connected = true;
        this.connecting = false;
        resolve();
      });

      this.socket.once("connect_error", (err) => {
        console.error("❌ Agent socket error:", err);
        this.connecting = false;
        reject(err);
      });

      this.socket.on("disconnect", () => {
        console.warn("🔌 Agent socket disconnected");
        this.connected = false;
        this.joinedRoom = null;
      });
    });
  }

  joinRoom(connectionId) {
    if (!this.connected) return;

    if (this.joinedRoom === connectionId) {
      console.log("♻️ Agent already in room", connectionId);
      return;
    }

    this.joinedRoom = connectionId;
    console.log("🚪 Agent joining room:", connectionId);

    this.socket.emit("join-room", {
      connectionId,
      userType: "agent",
    });
  }

  emit(event, data) {
    if (this.connected) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    this.socket?.on(event, callback);
  }

  off(event, callback) {
    this.socket?.off(event, callback);
  }

  disconnect() {
    this.socket?.disconnect();
    this.connected = false;
    this.joinedRoom = null;
  }
}

export default new SocketService();
