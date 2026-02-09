import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL.replace('/v1', '');

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        auth: {
          token: localStorage.getItem('token')
        }
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket.id);
        this.connected = true;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        reject(error);
      });

      this.socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
        this.connected = false;
      });
    });
  }

  joinRoom(connectionId, userType) {
    if (!this.connected) {
      console.error('Socket not connected');
      return;
    }
    console.log(`Joining room: ${connectionId} as ${userType}`);
    this.socket.emit('join-room', { connectionId, userType });
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.connected = false;
    }
  }
}

export default new SocketService();