const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log(`Connected to ${MONGO_URI}`);
  } catch (error) {
    console.error(`Error: ${error} `);
    process.exit(1);
  }
};

module.exports = connectDB;
