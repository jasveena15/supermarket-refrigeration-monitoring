const express = require("express");

const app = express();

app.use(express.json());

const monitoringUrl =
  process.env.MONITORING_URL || "http://host.docker.internal:4002/monitor";

app.post("/readings", async (req, res) => {
  const reading = req.body;

  console.log("Reading received by ingestion service:");
  console.log(reading);

  try {
    const response = await fetch(monitoringUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reading)
    });

    const result = await response.json();

    res.status(200).json({
      success: true,
      message: "Reading processed successfully",
      monitoringResult: result
    });
  } catch (error) {
    console.error("Error contacting monitoring service:", error.message);

    res.status(500).json({
      success: false,
      message: "Monitoring service unavailable"
    });
  }
});

app.listen(4001, () => {
  console.log("Ingestion service running on http://localhost:4001");
  console.log("Monitoring service URL:", monitoringUrl);
});