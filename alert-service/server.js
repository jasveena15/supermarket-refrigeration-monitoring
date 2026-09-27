const express = require("express");

const app = express();
app.use(express.json());

app.post("/alert", (req, res) => {
  const alert = req.body;

  console.log("Alert received:");
  console.log(alert);

  res.status(200).json({
    success: true,
    message: "Alert received by alert service"
  });
});

app.listen(4003, () => {
  console.log("Alert service running on http://localhost:4003");
});