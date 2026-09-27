const mqtt = require("mqtt");
const pool = require("./db");

const client = mqtt.connect("mqtt://localhost");

const units = [
  {
    storeId: "STORE_01",
    unitId: "FREEZER_01",
    temperature: -18,
    doorStatus: "CLOSED",
    compressorStatus: "ON",
    powerUsageWatts: 450
  },
  {
    storeId: "STORE_01",
    unitId: "FREEZER_02",
    temperature: -17,
    doorStatus: "CLOSED",
    compressorStatus: "ON",
    powerUsageWatts: 470
  },
  {
    storeId: "STORE_01",
    unitId: "FRIDGE_01",
    temperature: 4,
    doorStatus: "CLOSED",
    compressorStatus: "ON",
    powerUsageWatts: 300
  }
];

async function generateReading(unit) {
  const reading = {
    storeId: unit.storeId,
    unitId: unit.unitId,
    temperature: unit.temperature + (Math.random() * 2 - 1),
    doorStatus: unit.doorStatus,
    compressorStatus: unit.compressorStatus,
    powerUsageWatts:
      unit.powerUsageWatts + Math.floor(Math.random() * 30 - 15),
    timestamp: new Date().toISOString()
  };

  // Publish sensor data through MQTT
  client.publish(
    "supermarket/refrigeration/data",
    JSON.stringify(reading)
  );

  // Store sensor reading in PostgreSQL
  pool.query(
    `INSERT INTO sensor_readings
     (unit_id, temperature, door_status, compressor_status, power_usage, timestamp)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      reading.unitId,
      reading.temperature,
      reading.doorStatus,
      reading.compressorStatus,
      reading.powerUsageWatts,
      reading.timestamp
    ]
  )
  .then(() => {
    console.log("Reading stored in database");
  })
  .catch((error) => {
    console.error("Database insert error:", error.message);
  });

  // Send reading into the microservice pipeline
  try {
    const response = await fetch("http://localhost:4001/readings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reading)
    });

    const result = await response.json();

    console.log("Microservice result:");
    console.log(result);
  } catch (error) {
    console.error("Microservice error:", error.message);
  }

  console.log("Sensor reading:");
  console.log(reading);
}

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  setInterval(() => {
    units.forEach((unit) => {
      generateReading(unit);
    });
  }, 3000);
});

client.on("error", (error) => {
  console.error("MQTT connection error:", error.message);
});