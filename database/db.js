import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/lightning_stores", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default dbConnect;
