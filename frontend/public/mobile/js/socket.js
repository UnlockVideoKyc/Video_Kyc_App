class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.joinedRoom = null;
  }

  async connect(url) {
    if (this.connected) {
      console.log("♻️ Mobile socket already connected");
      return;
    }

    return new Promise((resolve, reject) => {
      console.log("🔌 Connecting mobile socket:", url);

      this.socket = io(url, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });

      this.socket.on("connect", () => {
        console.log("✅ Mobile socket connected:", this.socket.id);
        this.connected = true;

        // 🔁 Rejoin room after refresh / reconnect
        if (window.sessionData?.connectionId) {
          this.joinRoom(window.sessionData.connectionId);
        }

        resolve();
      });

      this.socket.on("disconnect", (reason) => {
        console.warn("❌ Mobile socket disconnected:", reason);
        this.connected = false;
        this.joinedRoom = null;
      });

      this.socket.on("connect_error", (err) => {
        console.error("❌ Mobile socket error:", err);
        reject(err);
      });
    });
  }

  joinRoom(connectionId) {
    if (!this.connected) return;

    if (this.joinedRoom === connectionId) {
      console.log("♻️ Mobile already in room:", connectionId);
      return;
    }

    this.joinedRoom = connectionId;
    console.log("🚪 Mobile joining room:", connectionId);

    this.socket.emit("join-room", {
      connectionId,
      userType: "customer",
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
  if (this.socket) {
    this.socket.disconnect();
  }
  this.connected = false;
  this.joinedRoom = null;

  // 🔥 ADD THIS
  window.socketListenersRegistered = false;

  console.log('🔌 Socket disconnected');
}

}

window.socketService = new SocketService();
