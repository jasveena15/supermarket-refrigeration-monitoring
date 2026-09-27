const express = require("express");

const app = express();
app.use(express.json());

app.post("/monitor", async (req, res) => {
  const data = req.body;
  const alerts = [];

  if (data.unitId.includes("FREEZER") && data.temperature > -10) {
    alerts.push("HIGH FREEZER TEMPERATURE");
  }

  if (data.unitId.includes("FRIDGE") && data.temperature > 8) {
    alerts.push("HIGH FRIDGE TEMPERATURE");
  }

  if (data.doorStatus === "OPEN") {
    alerts.push("DOOR OPEN");
  }

  if (data.compressorStatus === "FAILED") {
    alerts.push("COMPRESSOR FAILURE");
  }

  if (data.powerUsageWatts > 550) {
    alerts.push("HIGH POWER USAGE");
  }

  if (alerts.length > 0) {
    try {
      await fetch("http://localhost:4003/alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          unitId: data.unitId,
          alertType: alerts[0],
          severity: "CRITICAL",
          message: alerts.join(", ")
        })
      });
    } catch (error) {
      console.error("Error contacting alert service:", error.message);
    }
  }

  res.json({
    unitId: data.unitId,
    alerts: alerts,
    hasAlert: alerts.length > 0
  });
});

app.listen(4002, () => {
  console.log("Monitoring service running on http://localhost:4002");
});