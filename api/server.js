require('./src/config/env');

const app = require('./src/app');
const connectToDatabase = require('./src/config/db');

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`API listening on ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
