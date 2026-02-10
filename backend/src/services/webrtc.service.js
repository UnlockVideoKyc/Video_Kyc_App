const webrtcRepo = require("../repositories/webrtc.repo");
const { v4: uuidv4 } = require("uuid");
const geoip = require("geoip-lite");
const db = require("../config/db");

exports.initiateCustomerSession = async ({
  customerName,
  clientName,
  mobileNumber,
  latitude,
  longitude,
  deviceInfo,
  ipAddress,
}) => {
  try {
    const vcipId = `VCIP_${Date.now()}`;
    const connectionId = uuidv4();

    console.log('📝 Creating session:', { vcipId, connectionId });

    await db.query(
      `INSERT INTO Video_Kyc_Waitlist 
       (VcipId, CustomerName, ClientName, MobileNumber, ConnectionId, 
        Latitude, Longitude, DeviceInfo, IpAddress, CallStatus, CustomerStatus, CreatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'INITIATED', 'Live', NOW())`,
      [
        vcipId,
        customerName,
        clientName,
        mobileNumber,
        connectionId,
        latitude,
        longitude,
        JSON.stringify(deviceInfo),
        ipAddress,
      ]
    );

    const sessionToken = await webrtcRepo.createSession(vcipId, connectionId);

    await db.query(
      `INSERT INTO Live_Schedule_Kyc 
       (WaitlistId, CustomerStatus, L_CallStatus, CreatedAt, CustomerLatitude, CustomerLongitude)
       SELECT WaitlistId, 'Live', 'Connected', NOW(), ?, ?
       FROM Video_Kyc_Waitlist WHERE VcipId = ?`,
      [latitude, longitude, vcipId]
    );

    console.log('✅ Session created successfully');

    return {
      vcipId,
      connectionId,
      sessionToken,
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };
  } catch (error) {
    console.error('❌ Error in initiateCustomerSession:', error);
    throw error;
  }
};

exports.initiateAgentSession = async ({
  agtLoginId,
  connectionId,
  latitude,
  longitude,
}) => {
  await db.query(
    `UPDATE Live_Schedule_Kyc 
     SET AgentLatitude = ?, AgentLongitude = ?, L_CallStatus = 'Connected'
     WHERE EXISTS (
       SELECT 1 FROM Video_Kyc_Waitlist 
       WHERE Video_Kyc_Waitlist.WaitlistId = Live_Schedule_Kyc.WaitlistId 
       AND Video_Kyc_Waitlist.ConnectionId = ?
     )`,
    [latitude, longitude, connectionId]
  );

  await db.query(
    `UPDATE WebRTC_Sessions 
     SET AgtLoginId = ?, CallState = 'connecting'
     WHERE ConnectionId = ?`,
    [agtLoginId, connectionId]
  );

  return { success: true };
};

// ✅ FIXED END CALL FUNCTION
exports.endCall = async (connectionId, reason, callStatus) => {
  try {
    console.log('🔴 endCall called:', { connectionId, reason, callStatus });

    const session = await webrtcRepo.getSessionByConnectionId(connectionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const startTime = new Date(session.CreatedAt);
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000);
    console.log('⏱️ Duration:', duration, 'seconds');

    const [waitlistRows] = await db.query(
      `SELECT WaitlistId, VcipId, CustomerName FROM Video_Kyc_Waitlist WHERE ConnectionId = ?`,
      [connectionId]
    );

    if (waitlistRows.length === 0) {
      throw new Error("Waitlist entry not found");
    }

    const { WaitlistId, VcipId, CustomerName } = waitlistRows[0];
    console.log('📋 Waitlist:', WaitlistId, VcipId);

    // ✅ ALWAYS USE 'COMPLETED' STATUS
    console.log('📝 Status mapping:', callStatus, '→ COMPLETED');

    await db.query(
      `INSERT INTO Past_Kyc_Calls 
       (WaitlistId, VcipId, ConnectionId, CallStatus, CallDuration, DisconnectReason, CompletedAt, CreatedAt)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [WaitlistId, VcipId, connectionId, callStatus, duration, reason]
    );
    console.log('✅ Saved to Past_Kyc_Calls');

    await db.query(
      `DELETE FROM Live_Schedule_Kyc WHERE WaitlistId = ?`,
      [WaitlistId]
    );
    console.log('✅ Deleted from Live');

    // ✅ CRITICAL: Hard-coded 'COMPLETED' in SQL
    await db.query(
      `UPDATE Video_Kyc_Waitlist 
       SET CallStatus = 'COMPLETED', CustomerStatus = 'Completed'
       WHERE ConnectionId = ?`,
      [connectionId]
    );
    console.log('✅ Updated Waitlist to COMPLETED');

    await webrtcRepo.endSession(connectionId);
    console.log('✅ Session ended');

    return {
      success: true,
      duration,
      waitlistId: WaitlistId,
      vcipId: VcipId
    };

  } catch (error) {
    console.error('❌ endCall error:', error);
    throw error;
  }
};