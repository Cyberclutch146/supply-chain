const { onCall } = require("firebase-functions/v2/https");
const crypto = require("crypto");

const stableStringify = (obj) =>
  JSON.stringify(Object.keys(obj).sort().reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {}));

const getHashPayload = (c) => ({
  location: c.location,
  timestamp: c.timestamp,
  status: c.status,
  idleTime: c.idleTime,
  harshBrakes: c.harshBrakes,
  trafficLevel: c.trafficLevel,
  waitTime: c.waitTime,
  vehicleStatus: c.vehicleStatus,
  weather: c.weather,
  checkpointDelay: c.checkpointDelay,
  routeDeviation: c.routeDeviation
});

exports.logcheckpoint = onCall({
    cors: true,
  }, (request) => {
  const checkpointData = request.data;
  
  if (!checkpointData || !checkpointData.timestamp) {
    throw new Error("Invalid checkpoint data");
  }

  const payload = getHashPayload(checkpointData);
  const hash = crypto.createHash("sha256")
    .update(stableStringify(payload))
    .digest("hex");

  // Since we are skipping the blockchain right now, we create a mock txHash 
  // to simulate a transaction id from the smart contract.
  const mockTxHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('').slice(0, 8) + '...' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).slice(-4);

  return {
    verificationHash: hash,
    txHash: mockTxHash,
    verified: true
  };
});
