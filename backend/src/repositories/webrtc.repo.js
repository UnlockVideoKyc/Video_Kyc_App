const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.createSession = async (vcipId, connectionId) => {
  const sessionToken = uuidv4();
  
  await db.query(
    `INSERT INTO WebRTC_Sessions (ConnectionId, VcipId, SessionToken, CallState, SignalingState)
     VALUES (?, ?, ?, 'idle', 'new')`,
    [connectionId, vcipId, sessionToken]
  );

  return sessionToken;
};

exports.updateSessionState = async (connectionId, callState, signalingState) => {
  await db.query(
    `UPDATE WebRTC_Sessions 
     SET CallState = ?, SignalingState = ?, UpdatedAt = NOW()
     WHERE ConnectionId = ?`,
    [callState, signalingState, connectionId]
  );
};

exports.endSession = async (connectionId) => {
  await db.query(
    `UPDATE WebRTC_Sessions 
     SET CallState = 'ended', EndedAt = NOW()
     WHERE ConnectionId = ?`,
    [connectionId]
  );
};

exports.getSessionByConnectionId = async (connectionId) => {
  const [rows] = await db.query(
    `SELECT * FROM WebRTC_Sessions WHERE ConnectionId = ?`,
    [connectionId]
  );
  return rows[0];
};

exports.saveQualityMetrics = async (connectionId, metrics) => {
  await db.query(
    `INSERT INTO Call_Quality_Metrics 
     (ConnectionId, Bitrate, PacketLoss, Latency, Jitter, AudioLevel, VideoResolution)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      connectionId,
      metrics.bitrate,
      metrics.packetLoss,
      metrics.latency,
      metrics.jitter,
      metrics.audioLevel,
      metrics.videoResolution,
    ]
  );
};