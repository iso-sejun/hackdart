const fulfillmentService = require('../services/fulfillmentService');

async function markReadyForPickup(req, res, next) {
  try {
    const batch = await fulfillmentService.markBatchReadyForPickupByToken(req.params.token);

    res
      .status(200)
      .type('html')
      .send(`
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Hyperion Pickup Ready</title>
            <style>
              body {
                margin: 0;
                font-family: Arial, sans-serif;
                background: linear-gradient(180deg, #10245a 0%, #0f1b3d 55%, #0a1431 100%);
                color: #f5e6c8;
                min-height: 100vh;
                display: grid;
                place-items: center;
                padding: 24px;
              }
              .card {
                max-width: 640px;
                border: 1px solid rgba(201, 168, 76, 0.4);
                border-radius: 24px;
                background: rgba(15, 27, 61, 0.84);
                padding: 32px;
                box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
              }
              h1 {
                margin-top: 0;
                font-size: 40px;
              }
              p {
                line-height: 1.7;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <p style="letter-spacing:0.28em;text-transform:uppercase;color:#c9a84c;">Food Bank Ready</p>
              <h1>Batch marked ready for pickup.</h1>
              <p>
                Buyers linked to this shipment can now see the pickup location in their dashboard.
              </p>
              <p>
                Batch: <strong>${batch.id}</strong><br />
                Food bank: <strong>${batch.foodBank?.name || 'Pickup hub'}</strong>
              </p>
            </div>
          </body>
        </html>
      `);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .type('html')
      .send(`
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Hyperion Pickup Link</title>
            <style>
              body {
                margin: 0;
                font-family: Arial, sans-serif;
                background: linear-gradient(180deg, #10245a 0%, #0f1b3d 55%, #0a1431 100%);
                color: #f5e6c8;
                min-height: 100vh;
                display: grid;
                place-items: center;
                padding: 24px;
              }
              .card {
                max-width: 640px;
                border: 1px solid rgba(201, 168, 76, 0.4);
                border-radius: 24px;
                background: rgba(15, 27, 61, 0.84);
                padding: 32px;
                box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
              }
              h1 {
                margin-top: 0;
                font-size: 40px;
              }
              p {
                line-height: 1.7;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <p style="letter-spacing:0.28em;text-transform:uppercase;color:#c9a84c;">Food Bank Ready</p>
              <h1>That pickup link cannot be used.</h1>
              <p>${error.message || 'The ready-for-pickup link is invalid or has already been used.'}</p>
            </div>
          </body>
        </html>
      `);
  }
}

module.exports = {
  markReadyForPickup,
};
