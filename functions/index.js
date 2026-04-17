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

exports.analyzeRisk = onCall({
    cors: true,
  }, async (request) => {
  const checkpointData = request.data;

  // TASK 4 - WEATHER INTEGRATION (LIGHT MOCK)
  let weatherCondition = "clear";

  if (USE_REAL_SERVICES) {
      // fetch weather based on location
      // const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${checkpointData.location}&appid=YOUR_API_KEY`);
      // weatherCondition = weatherRes.data.weather[0].main.toLowerCase();
  } else {
      // return mock weather
      weatherCondition = "storm";
  }

  // TASK 3 - AI INTEGRATION (HYBRID)
  let aiResponse = {};

  if (USE_REAL_SERVICES) {
      // Prepare prompt
      const prompt = `Analyze risk for shipment at ${checkpointData.location}. Weather: ${weatherCondition}. Delays: ${checkpointData.idleTime}...`;
      // Prepare API call (e.g. Gemini AI or OpenAI)
      // const apiResult = await myAiClient.generateContent(prompt);
      // aiResponse = JSON.parse(apiResult.text);
  } else {
      // Simulate API processing delay
      await new Promise(res => setTimeout(res, 1500));
      
      aiResponse = {
          primary: "Environmental (Storm)",
          secondary: "Traffic",
          explanationText: "Severe weather combined with congestion is increasing delay risk."
      };
  }

  return aiResponse;
});
