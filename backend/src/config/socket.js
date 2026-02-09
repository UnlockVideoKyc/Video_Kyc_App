const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://YOUR_IP:5173",
        "http://localhost:3000",
        "http://YOUR_IP:3000",
        "http://172.21.213.46:3000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);
    
    socket.on('ping', (data) => {
      socket.emit('pong', { connectionId: data.connectionId });
    });

    socket.on('join-room', ({ connectionId, userType }) => {
      socket.join(connectionId);
      socket.data.userType = userType;
      console.log(`${userType} joined room: ${connectionId}`);
      socket.to(connectionId).emit('user-joined', { userType });
    });

    socket.on('offer', (data) => {
      const { offer, connectionId } = data;
      console.log('📤 Forwarding offer to room:', connectionId);
      socket.to(connectionId).emit('offer', { offer });
    });

    socket.on('answer', (data) => {
      const { answer, connectionId } = data;
      console.log('📤 Forwarding answer to room:', connectionId);
      socket.to(connectionId).emit('answer', { answer });
    });

    socket.on('ice-candidate', (data) => {
      const { candidate, connectionId } = data;
      console.log('🧊 Forwarding ICE candidate to room:', connectionId);
      socket.to(connectionId).emit('ice-candidate', { candidate });
    });

    // ✅ ADD THIS NEW HANDLER FOR AGENT MESSAGES
   socket.on('notify-customer', (data) => {
    const { room, message } = data;
    console.log('📨 ★★★ NOTIFY-CUSTOMER RECEIVED ON BACKEND! ★★★');
    console.log('   Room (connectionId):', room);
    console.log('   Message:', message);
    console.log('   Emitting to room:', room);
    
    // Relay to customer
    io.to(room).emit('agent-message', {
        message: message,
        timestamp: Date.now()
    });
    
    console.log('✅ agent-message emitted to room');
});

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });

  console.log('✅ Socket.IO server initialized');
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };