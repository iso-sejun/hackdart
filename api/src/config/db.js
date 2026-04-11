const mongoose = require('mongoose');

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    return mongoose.connection;
  }

  const connection = await mongoose.connect(process.env.MONGODB_URI);
  isConnected = connection.connections[0].readyState === 1;
  console.log('MongoDB connected');
  return connection;
}

module.exports = connectToDatabase;
