import apiFetch from "./http";

export const initiateAgentSession = (data) => 
  apiFetch('/webrtc/agent/initiate', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const endCall = (data) =>
  apiFetch('/webrtc/end-call', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const saveMetrics = (data) =>
  apiFetch('/webrtc/metrics', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  // Add this to your webrtc.api.js file

/**
 * Get connection details by VCIP ID
 * @param {string} vcipId - The VCIP ID
 * @returns {Promise<Object>} Connection details including connectionId
 */
export const getConnectionByVcipId = async (vcipId) => {
  try {
    console.log('🔍 Fetching connection details for VCIP:', vcipId);
    
    const response = await fetch(`/v1/webrtc/connection/${vcipId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if needed
        // 'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch connection: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Connection details received:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching connection details:', error);
    throw error;
  }
};