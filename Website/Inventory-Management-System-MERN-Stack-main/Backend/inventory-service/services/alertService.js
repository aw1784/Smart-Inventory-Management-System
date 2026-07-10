const axios = require("axios");

const ALERT_SERVICE_URL =
  process.env.ALERT_SERVICE_URL ||
  "http://alert-service:4006/api/alerts/send";

exports.sendLowStockAlert = async (inventory) => {
  try {
    await axios.post(ALERT_SERVICE_URL, {
      email: process.env.ALERT_EMAIL,
      productName: inventory.productName,
      quantity: inventory.quantity,
      threshold: inventory.lowStockThreshold,
    });

    console.log(
      `[inventory-service] Low stock alert sent for ${inventory.productName}`
    );
  } catch (err) {
    console.error(
      "[inventory-service] Failed to send alert:",
      err.response?.data || err.message
    );
  }
};