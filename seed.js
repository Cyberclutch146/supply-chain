import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0PSc39DME7z80FxoyNRT-T-RZJEF1RfI",
  authDomain: "habit-rpg-blazi-dev.firebaseapp.com",
  projectId: "habit-rpg-blazi-dev",
  storageBucket: "habit-rpg-blazi-dev.firebasestorage.app",
  messagingSenderId: "813647594253",
  appId: "1:813647594253:web:f55e1b41744b1a2f0c2644"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

const generateHash = (data) => btoa(stableStringify(getHashPayload(data)));

const run = async () => {
  const shipments = [
    {
      id: "SHP-10492",
      origin: "Shanghai, CN",
      destination: "Los Angeles, US",
      status: "In Transit",
      createdAt: new Date().toISOString(),
      createdBy: "system"
    },
    {
      id: "SHP-99231",
      origin: "Berlin, DE",
      destination: "Paris, FR",
      status: "Delivered",
      createdAt: new Date().toISOString(),
      createdBy: "system"
    }
  ];

  for (const s of shipments) {
    await setDoc(doc(db, "shipments", s.id), s);
  }

  const cp1 = {
    shipmentId: "SHP-10492",
    location: "Shanghai Port",
    timestamp: new Date(Date.now() - 48*60*60*1000).toISOString(),
    status: "In Transit",
    idleTime: 12,
    harshBrakes: 0,
    trafficLevel: "low",
    waitTime: 5,
    vehicleStatus: "ok",
    weather: "clear",
    checkpointDelay: 0,
    routeDeviation: false,
    txHash: "0x8F9B...D2E1",
    createdBy: "system",
    verified: true
  };
  cp1.verificationHash = generateHash(cp1);

  const cp2 = {
    shipmentId: "SHP-99231",
    location: "Paris Facility",
    timestamp: new Date(Date.now() - 24*60*60*1000).toISOString(),
    status: "Delivered",
    idleTime: 10,
    harshBrakes: 2,
    trafficLevel: "low",
    waitTime: 10,
    vehicleStatus: "ok",
    weather: "clear",
    checkpointDelay: 0,
    routeDeviation: false,
    txHash: "0x3A2C...9F40",
    createdBy: "system",
    verified: true
  };
  cp2.verificationHash = generateHash(cp2);

  const cp3 = {
    shipmentId: "SHP-99231",
    location: "Berlin Hub",
    timestamp: new Date(Date.now() - 72*60*60*1000).toISOString(),
    status: "In Transit",
    idleTime: 5,
    harshBrakes: 1,
    trafficLevel: "medium",
    waitTime: 30,
    vehicleStatus: "ok",
    weather: "rain",
    checkpointDelay: 10,
    routeDeviation: false,
    txHash: "0x1B4E...7C32",
    createdBy: "system",
    verified: true
  };
  cp3.verificationHash = generateHash(cp3);

  const checkpoints = [cp1, cp2, cp3];

  const { addDoc } = await import("firebase/firestore");
  
  for (const c of checkpoints) {
    await addDoc(collection(db, "checkpoints"), c);
  }

  console.log("Database seeded!");
  process.exit(0);
};

run().catch(console.error);
