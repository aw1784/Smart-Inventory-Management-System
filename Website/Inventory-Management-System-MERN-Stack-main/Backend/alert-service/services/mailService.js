const transporter = require("../config/mailConfig");

exports.sendLowStockEmail = async (
    email,
    productName,
    quantity,
    threshold
) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email || process.env.ALERT_EMAIL,
        subject: `⚠️ Low Stock Alert - ${productName}`,
        html: `
      <h2>Low Stock Alert</h2>

      <p>The following product has reached the low stock threshold.</p>

      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <td><strong>Product</strong></td>
          <td>${productName}</td>
        </tr>

        <tr>
          <td><strong>Current Quantity</strong></td>
          <td>${quantity}</td>
        </tr>

        <tr>
          <td><strong>Threshold</strong></td>
          <td>${threshold}</td>
        </tr>
      </table>

      <br>

      <b>Please restock this item as soon as possible.</b>
    `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
        `[alert-service] Alert email sent to ${email} for ${productName}`
    );

    return info;
};