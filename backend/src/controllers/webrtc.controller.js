const webrtcService = require("../services/webrtc.service");
const { getIO } = require("../config/socket");

exports.initiateCustomer = async (req, res) => {
  try {
    const {
      customerName,
      clientName,
      mobileNumber,
      latitude,
      longitude,
      deviceInfo,
    } = req.body;

    const ipAddress = req.ip || req.connection.remoteAddress;

    const result = await webrtcService.initiateCustomerSession({
      customerName,
      clientName,
      mobileNumber,
      latitude,
      longitude,
      deviceInfo,
      ipAddress,
    });

    res.status(200).json({
      success: true,
      message: "Customer session initiated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error initiating customer session:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.initiateAgent = async (req, res) => {
  try {
    const { connectionId, latitude, longitude } = req.body;
    const agtLoginId = req.user?.id;

    if (!connectionId) {
      return res.status(400).json({
        success: false,
        message: "Connection ID is required",
      });
    }

    console.log('🔗 Agent initiating session:', { 
      agtLoginId, 
      connectionId, 
      latitude, 
      longitude 
    });

    await webrtcService.initiateAgentSession({
      agtLoginId,
      connectionId,
      latitude,
      longitude,
    });

    res.status(200).json({
      success: true,
      message: "Agent session initiated successfully",
      data: {
        connectionId,
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });
  } catch (error) {
    console.error("Error initiating agent session:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.endCall = async (req, res) => {
  try {
    const { connectionId, reason, callStatus, endedBy } = req.body;

    if (!connectionId) {
      return res.status(400).json({
        success: false,
        message: "Connection ID is required",
      });
    }

    console.log('🔴 Ending call:', { 
      connectionId, 
      reason, 
      callStatus, 
      endedBy 
    });

    // End the call and move to past KYC
    const result = await webrtcService.endCall(
      connectionId, 
      reason, 
      callStatus || 'REJECTED'
    );

    // Notify the customer via socket that the call has ended
    try {
      const io = getIO();
      io.to(connectionId).emit('call-ended-by-agent', {
        reason,
        callStatus,
        endedBy
      });
      console.log('📡 Notified customer about call end via socket');
    } catch (socketError) {
      console.error('⚠️ Failed to notify via socket:', socketError);
      // Don't fail the request if socket notification fails
    }

    res.status(200).json({
      success: true,
      message: "Call ended successfully",
      data: {
        connectionId,
        duration: result.duration,
        callStatus
      },
    });
  } catch (error) {
    console.error("❌ Error ending call:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.saveMetrics = async (req, res) => {
  try {
    const { connectionId, metrics } = req.body;

    if (!connectionId) {
      return res.status(400).json({
        success: false,
        message: "Connection ID is required",
      });
    }

    // Save network quality metrics
    // You can implement this based on your requirements
    console.log('📊 Saving metrics for connection:', connectionId, metrics);

    res.status(200).json({
      success: true,
      message: "Metrics saved successfully",
    });
  } catch (error) {
    console.error("Error saving metrics:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};