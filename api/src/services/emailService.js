const nodemailer = require('nodemailer');

let transporter = null;
const HACKATHON_FOOD_BANK_EMAIL = 'unboxingvidskim@gmail.com';

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    });
  } else {
    transporter = nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  return transporter;
}

function formatAddress(address) {
  if (!address) {
    return '';
  }

  return `${address.line1}, ${address.city}, ${address.state} ${address.postalCode}`;
}

function buildManifestText({ sellerName, foodBank, batch, orders, readyLink }) {
  const aggregatedLines = batch.aggregatedItems
    .map((item) => `- ${item.productNameSnapshot}: ${item.totalQuantity} ${item.unit}`)
    .join('\n');

  const orderLines = orders
    .map((order) => {
      const items = order.items
        .map((item) => `    • ${item.productNameSnapshot}: ${item.quantity} ${item.unit}`)
        .join('\n');

      return `Order ${order.orderGroup?.orderNumber || order.orderGroupId}\nBuyer: ${
        order.buyerName
      }\n${items}`;
    })
    .join('\n\n');

  return [
    `Food bank manifest for ${foodBank.name}`,
    '',
    `Seller: ${sellerName}`,
    `Batch ID: ${batch._id}`,
    `Pickup location: ${formatAddress(foodBank.address)}`,
    '',
    'Combined shipment:',
    aggregatedLines,
    '',
    'Pack by buyer:',
    orderLines,
    '',
    'Mark ready for pickup:',
    readyLink,
  ].join('\n');
}

async function sendFoodBankManifest({ sellerName, foodBank, batch, orders, readyLink }) {
  const transport = getTransporter();
  const fromAddress =
    process.env.EMAIL_FROM ||
    (process.env.SMTP_USER ? process.env.SMTP_USER : 'no-reply@hackdart.local');

  const text = buildManifestText({ sellerName, foodBank, batch, orders, readyLink });
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a;">
      <h2>Food bank manifest for ${foodBank.name}</h2>
      <p><strong>Seller:</strong> ${sellerName}</p>
      <p><strong>Batch ID:</strong> ${batch._id}</p>
      <p><strong>Pickup location:</strong> ${formatAddress(foodBank.address)}</p>
      <h3>Combined shipment</h3>
      <ul>
        ${batch.aggregatedItems
          .map(
            (item) =>
              `<li>${item.productNameSnapshot}: ${item.totalQuantity} ${item.unit}</li>`
          )
          .join('')}
      </ul>
      <h3>Pack by buyer</h3>
      ${orders
        .map(
          (order) => `
            <div style="margin-bottom: 16px;">
              <strong>Order ${order.orderGroup?.orderNumber || order.orderGroupId}</strong><br />
              Buyer: ${order.buyerName}
              <ul>
                ${order.items
                  .map(
                    (item) =>
                      `<li>${item.productNameSnapshot}: ${item.quantity} ${item.unit}</li>`
                  )
                  .join('')}
              </ul>
            </div>
          `
        )
        .join('')}
      <h3>Ready for pickup</h3>
      <p>
        <a href="${readyLink}" style="display:inline-block;padding:12px 18px;background:#c9a84c;color:#0f1b3d;text-decoration:none;border-radius:999px;font-weight:700;">
          Mark batch ready for pickup
        </a>
      </p>
    </div>
  `;

  const info = await transport.sendMail({
    from: fromAddress,
    to: HACKATHON_FOOD_BANK_EMAIL,
    subject: `HackDart batch ready from ${sellerName}`,
    text,
    html,
  });

  const manualSendUrl = `mailto:${encodeURIComponent(HACKATHON_FOOD_BANK_EMAIL)}?subject=${encodeURIComponent(
    `HackDart batch ready from ${sellerName}`
  )}&body=${encodeURIComponent(text)}`;

  return {
    accepted: info.accepted || [],
    rejected: info.rejected || [],
    messageId: info.messageId || null,
    preview: typeof info.message === 'string' ? info.message : text,
    usedJsonTransport: !process.env.SMTP_HOST,
    recipient: HACKATHON_FOOD_BANK_EMAIL,
    manualSendUrl,
  };
}

module.exports = {
  sendFoodBankManifest,
  HACKATHON_FOOD_BANK_EMAIL,
};
