const app = require('./app');
const connectDB = require('./db');

let isConnected = false;

module.exports = async (req, res) => {
  // Connect to MongoDB if not already connected
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('MongoDB connected in serverless function');
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  
  // Handle the request
  return app(req, res);
};
