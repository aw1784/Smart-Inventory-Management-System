const mongoose = require('mongoose');

const connectDB = async (uri) => {
  const mongoUri =
    uri || process.env.PRODUCT_MONGO_URI || 'mongodb://localhost:27017/inventory_products';
  await mongoose.connect(mongoUri);
  return mongoose.connection;
};

module.exports = { connectDB };
