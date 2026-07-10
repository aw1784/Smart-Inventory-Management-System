const express = require("express");
const cors = require("cors");
require("dotenv").config();

const alertRoutes = require("./routes/alertRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "alert-service",
  });
});

app.use("/api/alerts", alertRoutes);

const PORT = process.env.ALERT_SERVICE_PORT || 4006;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[alert-service] listening on ${PORT}`);
  });
}

module.exports = app;