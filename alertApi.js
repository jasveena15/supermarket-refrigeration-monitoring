const express = require("express");
const pool = require("./db");

const app = express();
app.use(express.json());

app.post("/alerts", async (req, res) => {
  try {
    const {
      unitId,
      alertType,
      severity,
      message
    } = req.body;

    await pool.query(
      `INSERT INTO alerts
       (unit_id, alert_type, severity, message)
       VALUES ($1, $2, $3, $4)`,
      [unitId, alertType, severity, message]
    );

    res.status(201).json({
      success: true,
      message: "Alert stored successfully"
    });
  } catch (error) {
    console.error("Alert database error:", error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Alert API running on http://localhost:3000");
});