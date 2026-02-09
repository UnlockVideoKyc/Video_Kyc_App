import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoCallAgentSection from "../../components/VideoCallAgentSection";
import VideoCallCustomerSection from "../../components/VideoCallCustomerSection";
import VerificationChecklist from "../../components/VerificationChecklist";
import socketService from "../../services/socket.service";
import webrtcService from "../../services/webrtc.service";

const SESSION_STORAGE_KEY = 'digikhata_agent_session';

const CheckLocationVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Get data from navigation state or sessionStorage
  let { connectionId, customer } = location.state || {};
  
  // ✅ Try to restore from sessionStorage if not in state
  useEffect(() => {
    if (!connectionId) {
      try {
        const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (saved) {
          const session = JSON.parse(saved);
          // Check if session is less than 4 hours old
          const fourHours = 4 * 60 * 60 * 1000;
          if (Date.now() - session.timestamp < fourHours) {
            connectionId = session.connectionId;
            customer = session.customer;
            console.log('🔄 Restored session from storage:', connectionId);
            setIsReconnecting(true);
          } else {
            console.log('⏰ Session expired');
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('❌ Error restoring session:', error);
      }
    } else {
      // Save to sessionStorage for reconnection
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
          connectionId,
          customer,
          timestamp: Date.now()
        }));
        console.log('💾 Session saved to storage');
      } catch (error) {
        console.error('❌ Error saving session:', error);
      }
    }
  }, []);

  useEffect(() => {
    console.log('🎬 CheckLocationVerify mounted');

    // Get local stream
    if (webrtcService.localStream) {
      setLocalStream(webrtcService.localStream);
    }

    // Set up remote stream callback
    const handleRemoteStream = (stream) => {
      console.log('📹 Remote stream received');
      setRemoteStream(stream);
    };

    webrtcService.onRemoteStream = handleRemoteStream;

    // Check if already exists
    if (webrtcService.remoteStream?.getTracks().length > 0) {
      setRemoteStream(webrtcService.remoteStream);
    }

    // ✅ Reconnect if needed
    if (isReconnecting && connectionId) {
      console.log('🔄 Reconnecting to session...');
      reconnectToSession(connectionId);
    }

    return () => {
      socketService.socket?.off('agent-message');
    };
  }, []);

  // ✅ Reconnection logic
  const reconnectToSession = async (connId) => {
    try {
      console.log('🔌 Reconnecting socket...');
      
      if (!socketService.socket?.connected) {
        await socketService.connect();
      }
      
      console.log('🚪 Rejoining room:', connId);
      socketService.joinRoom(connId, 'agent');
      
      // Recreate peer connection if needed
      if (!webrtcService.peerConnection && webrtcService.localStream) {
        console.log('🔗 Recreating peer connection...');
        webrtcService.createPeerConnection(
          socketService,
          connId,
          (remoteStream) => {
            console.log('📹 Remote stream received after reconnection');
            setRemoteStream(remoteStream);
          }
        );
        
        // Re-setup socket listeners
        socketService.on('offer', async (data) => {
          console.log('📨 Received OFFER after reconnection');
          await webrtcService.handleOffer(data.offer, socketService, connId);
        });

        socketService.on('ice-candidate', async (data) => {
          console.log('🧊 Received ICE candidate');
          await webrtcService.handleIceCandidate(data.candidate);
        });
      }
      
      console.log('✅ Reconnection complete');
      setIsReconnecting(false);
    } catch (error) {
      console.error('❌ Reconnection failed:', error);
      alert('Failed to reconnect to call. Please start a new call.');
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      navigate('/work-dashboard');
    }
  };

  // Memoize streams
  const memoizedRemoteStream = useMemo(() => remoteStream, [remoteStream]);
  const memoizedLocalStream = useMemo(() => localStream, [localStream]);

  const handleFullScreenToggle = (fullScreenState) => {
    setIsFullScreen(fullScreenState);
  };

  const handleCallEnded = () => {
    // ✅ Clear session on call end
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    navigate('/work-dashboard');
  };

  if (!connectionId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Error: No connection information</h3>
        <button onClick={() => navigate('/work-dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="row">
        <div className={isFullScreen ? "col-md-9 mt-5" : "col-md-3 mt-5"}>
           <VideoCallAgentSection 
              onFullScreenToggle={handleFullScreenToggle}
              localStream={memoizedRemoteStream}
              connectionId={connectionId}
              onCallEnded={handleCallEnded}
            />
        </div>

        {!isFullScreen && (
          <div className="col-md-3 mt-5">
            <VideoCallCustomerSection remoteStream={memoizedLocalStream} />
          </div>
        )}

        <div className={isFullScreen ? "col-md-3 mt-5" : "col-md-6 mt-5"}>
          <VerificationChecklist />
        </div>
      </div>
    </>
  );
};

export default CheckLocationVerify;