// ================================
// WebRTC Service for Mobile App
// ================================

class WebRTCService {
    constructor() {
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;

        this.configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' }
            ]
        };

        // 🔁 Listen for Bluetooth / device changes
        navigator.mediaDevices.addEventListener("devicechange", async () => {
            console.log("🔄 Media device changed (Bluetooth connected / disconnected)");
        });
    }

    // =========================================
    // 🎧 Get preferred Bluetooth microphone
    // =========================================
    async getPreferredAudioInput() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(d => d.kind === "audioinput");

        console.log("🎤 Available audio input devices:");
        audioInputs.forEach(d =>
            console.log(`- ${d.label} (${d.deviceId})`)
        );

        // Prefer Bluetooth / Headset mic
        const bluetoothMic = audioInputs.find(d =>
            d.label.toLowerCase().includes("bluetooth") ||
            d.label.toLowerCase().includes("headset") ||
            d.label.toLowerCase().includes("hands-free")
        );

        return bluetoothMic ? bluetoothMic.deviceId : null;
    }

    // =========================================
    // 🔊 Get preferred Bluetooth speaker
    // =========================================
    async getPreferredAudioOutput() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioOutputs = devices.filter(d => d.kind === "audiooutput");

        console.log("🔊 Available audio output devices:");
        audioOutputs.forEach(d =>
            console.log(`- ${d.label} (${d.deviceId})`)
        );

        const bluetoothSpeaker = audioOutputs.find(d =>
            d.label.toLowerCase().includes("bluetooth") ||
            d.label.toLowerCase().includes("headset")
        );

        return bluetoothSpeaker ? bluetoothSpeaker.deviceId : null;
    }

    // =========================================
    // 📹 Get local media stream (FIXED)
    // =========================================
    async getLocalStream() {
        try {
            console.log("📹 Requesting camera & microphone...");

            const audioDeviceId = await this.getPreferredAudioInput();

            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: {
                    deviceId: audioDeviceId ? { exact: audioDeviceId } : undefined,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 1
                }
            });

            console.log("✅ Local stream obtained");
            console.log("🎤 Audio tracks:", this.localStream.getAudioTracks().length);
            console.log("📹 Video tracks:", this.localStream.getVideoTracks().length);

            this.localStream.getAudioTracks().forEach((track, i) => {
                console.log(`🎤 Audio track ${i}:`, {
                    label: track.label,
                    enabled: track.enabled,
                    muted: track.muted,
                    readyState: track.readyState
                });
            });

            return this.localStream;
        } catch (error) {
            console.error("❌ Error getting local stream:", error);
            throw error;
        }
    }

    // =========================================
    // 🔗 Create Peer Connection
    // =========================================
    createPeerConnection(socketService, connectionId) {
        console.log("🔗 Creating peer connection...");
        this.peerConnection = new RTCPeerConnection(this.configuration);

        // ➕ Add local tracks
        this.localStream.getTracks().forEach(track => {
            this.peerConnection.addTrack(track, this.localStream);
            console.log(`➕ Added ${track.kind} track`);
        });

        // 📥 Remote stream handling
        this.peerConnection.ontrack = async (event) => {
            console.log("📥 Remote track received:", event.track.kind);

            if (event.streams && event.streams[0]) {
                this.remoteStream = event.streams[0];
                const remoteVideo = document.getElementById("remoteVideo");

                if (remoteVideo) {
                    remoteVideo.srcObject = this.remoteStream;
                    remoteVideo.muted = false;
                    remoteVideo.volume = 1.0;

                    // 🔊 Force Bluetooth speaker if available
                    if (typeof remoteVideo.setSinkId === "function") {
                        const speakerId = await this.getPreferredAudioOutput();
                        if (speakerId) {
                            await remoteVideo.setSinkId(speakerId);
                            console.log("🔊 Output routed to Bluetooth speaker");
                        }
                    }

                    await remoteVideo.play().catch(err =>
                        console.warn("⚠️ Autoplay blocked:", err)
                    );
                }
            }
        };

        // 🧊 ICE candidates
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socketService.emit("ice-candidate", {
                    candidate: event.candidate,
                    connectionId
                });
            }
        };

        // 🔗 Connection state
        this.peerConnection.onconnectionstatechange = () => {
            console.log("🔗 Connection state:", this.peerConnection.connectionState);
        };

        return this.peerConnection;
    }

    // =========================================
    // 📤 Create Offer
    // =========================================
    async createOffer(socketService, connectionId) {
        const offer = await this.peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        });

        await this.peerConnection.setLocalDescription(offer);

        socketService.emit("offer", {
            offer,
            connectionId
        });
    }

    // =========================================
    // 📨 Handle Answer
    // =========================================
    async handleAnswer(answer) {
        await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
        );
        console.log("✅ Answer set");
    }

    // =========================================
    // 🧊 Handle ICE
    // =========================================
    async handleIceCandidate(candidate) {
        if (candidate) {
            await this.peerConnection.addIceCandidate(
                new RTCIceCandidate(candidate)
            );
        }
    }

    // =========================================
    // 🎤 Toggle Audio
    // =========================================
    toggleAudio() {
        const track = this.localStream?.getAudioTracks()[0];
        if (!track) return false;
        track.enabled = !track.enabled;
        return track.enabled;
    }

    // =========================================
    // 📹 Toggle Video
    // =========================================
    toggleVideo() {
        const track = this.localStream?.getVideoTracks()[0];
        if (!track) return false;
        track.enabled = !track.enabled;
        return track.enabled;
    }

    // =========================================
    // 🔴 Close connection
    // =========================================
    close() {
        console.log("🔴 Closing WebRTC");

        this.peerConnection?.close();
        this.peerConnection = null;

        this.localStream?.getTracks().forEach(t => t.stop());
        this.localStream = null;
        this.remoteStream = null;
    }
}

// ✅ Singleton instance
const webrtcService = new WebRTCService();
