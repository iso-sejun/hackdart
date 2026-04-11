const cors = require('cors');
const helmet = require('helmet');

const allowedOrigins = process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim());

module.exports = [
  helmet(),
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
  }),
];
