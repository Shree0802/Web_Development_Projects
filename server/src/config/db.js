const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kolhapur_tourism';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    isConnected = false;
    console.warn(`⚠️ MongoDB connection error: ${err.message}. Running with high-performance JSON persistence fallback.`);
    return null;
  }
}

function getIsConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

module.exports = {
  connectDB,
  getIsConnected,
  mongoose
};
