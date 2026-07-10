const { sendLowStockEmail } = require("../services/mailService");

exports.sendAlert = async (req, res) => {
  try {
    const { email, productName, quantity, threshold } = req.body;

    if (!productName || quantity === undefined || threshold === undefined) {
      return res.status(400).json({
        message: "productName, quantity, and threshold are required",
      });
    }

    await sendLowStockEmail(
      email || process.env.ALERT_EMAIL,
      productName,
      quantity,
      threshold
    );

    return res.status(200).json({
      message: "Alert email sent successfully",
    });

  } catch (err) {
    return res.status(500).json({
      message: "Failed to send alert email",
      error: err.message,
    });
  }
};