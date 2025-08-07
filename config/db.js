
const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI is not set in environment variables.");
    process.exit(1);
  }

  // Log which MongoDB URI is being used
  if (mongoUri.includes("localhost") || mongoUri.includes("127.0.0.1")) {
    console.log("ℹ️ Using local/Docker MongoDB instance:", mongoUri);
  } else {
    console.log("ℹ️ Using remote/live MongoDB instance:", mongoUri);
  }

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: "majority",
      maxPoolSize: 10,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
