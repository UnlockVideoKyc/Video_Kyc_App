const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' }
];

class WebRTCService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = new MediaStream(); // ✅ PERSISTENT remote stream
    this.onRemoteStream = null; // ✅ Callback for UI updates
  }

  async getLocalStream() {
    try {
      // ✅ Stop any existing streams first
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }

      console.log('📹 Requesting camera and microphone access...');

      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      console.log('✅ Got local stream');
      return this.localStream;
    } catch (error) {
      console.error('❌ Error getting local stream:', error);
      
      if (error.name === 'NotReadableError') {
        throw new Error('Camera is being used by another application. Please close other apps using the camera.');
      } else if (error.name === 'NotAllowedError') {
        throw new Error('Camera permission denied. Please allow camera access.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No camera found on this device.');
      }
      
      throw error;
    }
  }

  createPeerConnection(socketService, connectionId, onRemoteStreamCallback) {
    console.log('🔗 Creating peer connection...');
    
    this.peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    // ✅ Store callback if provided
    if (onRemoteStreamCallback) {
      this.onRemoteStream = onRemoteStreamCallback;
    }

    // ✅ Add local stream tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        console.log(`➕ Adding ${track.kind} track to peer connection`);
        this.peerConnection.addTrack(track, this.localStream);
      });
    }

    // ✅ CRITICAL: Handle incoming remote tracks
    this.peerConnection.ontrack = (event) => {
      console.log("📹 Remote track received:", event.track.kind);
      console.log("📹 Track state:", event.track.readyState);
      console.log("📹 Streams:", event.streams.length);

      // ✅ Add track to persistent remote stream
      if (!this.remoteStream.getTracks().find(t => t.id === event.track.id)) {
        this.remoteStream.addTrack(event.track);
        console.log(`✅ Added ${event.track.kind} track to remote stream`);
        console.log(`📊 Remote stream now has ${this.remoteStream.getTracks().length} tracks`);
      }

      // ✅ Notify UI callback immediately
      if (this.onRemoteStream) {
        console.log("🚀 Calling onRemoteStream callback");
        this.onRemoteStream(this.remoteStream);
      }

      // ✅ Monitor track state
      event.track.onended = () => {
        console.log(`⚠️ Remote ${event.track.kind} track ended`);
      };

      event.track.onmute = () => {
        console.log(`🔇 Remote ${event.track.kind} track muted`);
      };

      event.track.onunmute = () => {
        console.log(`🔊 Remote ${event.track.kind} track unmuted`);
      };
    };

    // ✅ Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 Sending ICE candidate');
        socketService.emit('ice-candidate', {
          candidate: event.candidate,
          connectionId: connectionId
        });
      } else {
        console.log('✅ All ICE candidates sent');
      }
    };

    // ✅ Monitor connection state
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection.connectionState;
      console.log('🔗 Connection state:', state);
      
      if (state === 'connected') {
        console.log('✅ Peer connection established');
      } else if (state === 'failed') {
        console.error('❌ Peer connection failed');
      }
    };

    // ✅ Monitor ICE connection state
    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('🧊 ICE connection state:', this.peerConnection.iceConnectionState);
    };

    // ✅ Monitor signaling state
    this.peerConnection.onsignalingstatechange = () => {
      console.log('📡 Signaling state:', this.peerConnection.signalingState);
    };

    console.log('✅ Peer connection created');
    return this.peerConnection;
  }

  async createOffer(socketService, connectionId) {
    try {
      console.log('📤 Creating offer...');
      
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await this.peerConnection.setLocalDescription(offer);
      console.log('✅ Local description set');
      
      console.log('📤 Sending offer to peer');
      socketService.emit('offer', {
        offer: offer,
        connectionId: connectionId
      });
    } catch (error) {
      console.error('❌ Error creating offer:', error);
      throw error;
    }
  }

  async handleAnswer(answer) {
    try {
      console.log('📨 Handling answer...');
      
      if (this.peerConnection.signalingState !== 'have-local-offer') {
        console.warn('⚠️ Unexpected signaling state:', this.peerConnection.signalingState);
      }
      
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('✅ Answer set successfully');
    } catch (error) {
      console.error('❌ Error handling answer:', error);
      throw error;
    }
  }

  async handleOffer(offer, socketService, connectionId) {
    try {
      console.log('📨 Handling offer...');
      
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      console.log('✅ Remote description set');
      
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      console.log('✅ Local description (answer) set');
      
      console.log('📤 Sending answer');
      socketService.emit('answer', {
        answer: answer,
        connectionId: connectionId
      });
    } catch (error) {
      console.error('❌ Error handling offer:', error);
      throw error;
    }
  }

  async handleIceCandidate(candidate) {
    try {
      if (!this.peerConnection) {
        console.error('❌ No peer connection available');
        return;
      }

      if (!candidate) {
        console.warn('⚠️ Received null ICE candidate');
        return;
      }

      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      console.log('✅ ICE candidate added');
    } catch (error) {
      console.error('❌ Error adding ICE candidate:', error);
    }
  }

  toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        console.log('🎤 Audio:', audioTrack.enabled ? 'ON' : 'OFF');
        return audioTrack.enabled;
      }
    }
    return false;
  }

  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        console.log('📹 Video:', videoTrack.enabled ? 'ON' : 'OFF');
        return videoTrack.enabled;
      }
    }
    return false;
  }

  close() {
    console.log('🔴 Closing WebRTC connection...');
    
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
        console.log(`⏹️ Stopped ${track.kind} track`);
      });
      this.localStream = null;
    }
    
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
      this.remoteStream = new MediaStream();
    }
    
    console.log('✅ WebRTC connection closed');
  }

  async getCallQuality() {
    if (!this.peerConnection) return null;

    try {
      const stats = await this.peerConnection.getStats();
      let quality = {
        bitrate: 0,
        packetLoss: 0,
        jitter: 0,
        rtt: 0
      };

      stats.forEach(report => {
        if (report.type === 'inbound-rtp' && report.kind === 'video') {
          quality.bitrate = report.bytesReceived 
            ? Math.round((report.bytesReceived * 8) / 1000) 
            : 0;
          quality.packetLoss = report.packetsLost || 0;
          quality.jitter = report.jitter || 0;
        }
        
        if (report.type === 'candidate-pair' && report.state === 'succeeded') {
          quality.rtt = report.currentRoundTripTime || 0;
        }
      });

      return quality;
    } catch (error) {
      console.error('Error getting call quality:', error);
      return null;
    }
  }

  getConnectionState() {
    return this.peerConnection ? this.peerConnection.connectionState : 'closed';
  }

  getIceConnectionState() {
    return this.peerConnection ? this.peerConnection.iceConnectionState : 'closed';
  }
}

export default new WebRTCService();