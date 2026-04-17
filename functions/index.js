const { onCall } = require("firebase-functions/v2/https");
const crypto = require("crypto");
const { ethers } = require("ethers");

// SWAPPABLE CONFIG
const USE_REAL_SERVICES = false;

const stableStringify = (obj) =>
  JSON.stringify(Object.keys(obj).sort().reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
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

exports.logCheckpoint = onCall({
    cors: true,
  }, async (request) => {
  const checkpointData = request.data;
  
  if (!checkpointData || !checkpointData.timestamp) {
    throw new Error("Invalid checkpoint data");
  }

  // TASK 2 - REAL HASHING
  const payload = getHashPayload(checkpointData);
  const hash = crypto.createHash("sha256")
    .update(stableStringify(payload))
    .digest("hex");

  let txHash;

  // TASK 1 & 5 - BLOCKCHAIN INTEGRATION (HYBRID)
  if (USE_REAL_SERVICES) {
      // provider
      const provider = new ethers.JsonRpcProvider("RPC_URL");
      // wallet
      const wallet = new ethers.Wallet("PRIVATE_KEY", provider);
      // contract instance
      const abi = ["function logCheckpoint(bytes32 hash) public"];
      const contractAddress = "0x0000000000000000000000000000000000000000";
      const contract = new ethers.Contract(contractAddress, abi, wallet);
      // transaction call
      const tx = await contract.logCheckpoint(`0x${hash}`);
      await tx.wait();
      txHash = tx.hash;
  } else {
      // Mocked Blockchain Transaction
      await new Promise(res => setTimeout(res, 2000));
      txHash = "0x" + crypto.randomBytes(32).toString("hex");
  }

  return {
    verificationHash: hash,
    txHash: txHash
  };
});

const calculateRisk = (c) => {
  let score = 0;
  if (c.idleTime > 60) score += 15;
  if (c.harshBrakes > 10) score += 15;
  if (c.trafficLevel === "high") score += 15;
  if (c.waitTime > 30) score += 10;
  if (c.vehicleStatus === "warning") score += 10;
  if (c.vehicleStatus === "breakdown") score += 25;
  if (c.weather === "storm") score += 20;
  if (c.checkpointDelay > 20) score += 10;
  if (c.routeDeviation) score += 20;
  return Math.min(score, 100);
};

const getDelayProbability = (risk) => {
  if (risk < 30) return 20;
  if (risk < 60) return 50;
  return 75;
};

const getDelayBreakdown = (c) => {
  const factors = [
    { id: 'weather', label: "Environmental (Storm)", weight: c.weather === "storm" ? 100 : 0 },
    { id: 'vehicle', label: "Vehicle Breakdown", weight: c.vehicleStatus === "breakdown" ? 90 : 0 },
    { id: 'deviation', label: "Route Deviation", weight: c.routeDeviation ? 80 : 0 },
    { id: 'traffic', label: "Traffic Congestion", weight: c.trafficLevel === "high" ? 70 : 0 },
    { id: 'driver', label: "Driver Anomaly", weight: (c.idleTime > 60 || c.harshBrakes > 10) ? 60 : 0 },
    { id: 'warning', label: "Vehicle Warning", weight: c.vehicleStatus === "warning" ? 50 : 0 },
    { id: 'wait', label: "Operational Delay", weight: c.waitTime > 30 ? 40 : 0 },
    { id: 'compliance', label: "Compliance Delay", weight: c.checkpointDelay > 20 ? 30 : 0 },
  ].filter(f => f.weight > 0).sort((a, b) => b.weight - a.weight);

  if (factors.length === 0) {
    return {
      primary: "Normal Conditions",
      secondary: null,
      explanationText: "Current logistics flow is optimal with no significant risk factors detected."
    };
  }

  const primary = factors[0].label;
  const secondary = factors.length > 1 ? factors[1].label : null;

  let explanationText = "";
  if (secondary) {
    explanationText = `${primary} combined with ${secondary.toLowerCase()} is significantly increasing delay probability.`;
  } else {
    explanationText = `${primary} alone is significantly increasing delay risk.`;
  }

  return { primary, secondary, explanationText };
};


exports.analyzeRisk = onCall({
    cors: true,
  }, async (request) => {
  const checkpointData = request.data;
  const c = {
    idleTime: Number(checkpointData.idleTime) || 0,
    harshBrakes: Number(checkpointData.harshBrakes) || 0,
    trafficLevel: checkpointData.trafficLevel || 'low',
    waitTime: Number(checkpointData.waitTime) || 0,
    vehicleStatus: checkpointData.vehicleStatus || 'ok',
    weather: checkpointData.weather || 'clear',
    checkpointDelay: Number(checkpointData.checkpointDelay) || 0,
    routeDeviation: Boolean(checkpointData.routeDeviation)
  };

  let aiResponse = {};

  if (USE_REAL_SERVICES) {
      // Prepare prompt
      const prompt = `Analyze risk for shipment at ${checkpointData.location}. Weather: ${c.weather}. Delays: ${c.idleTime}...`;
      // AI logic here using real services
      // ...
  } else {
      // Simulate API processing delay
      await new Promise(res => setTimeout(res, 1500));
      
      const riskScore = calculateRisk(c);
      const delayProb = getDelayProbability(riskScore);
      const breakdown = getDelayBreakdown(c);

      aiResponse = {
          riskScore,
          delayProb,
          primary: breakdown.primary,
          secondary: breakdown.secondary,
          explanationText: breakdown.explanationText
      };
  }

  return aiResponse;
});
