const mongoose = require('mongoose');

const connectDB = async (uri) => {
  const mongoUri =
    uri ||
    process.env.STATISTICS_MONGO_URI ||
    'mongodb://localhost:27017/inventory_statistics';
  await mongoose.connect(mongoUri);
  return mongoose.connection;
};

module.exports = { connectDB };
