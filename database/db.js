import mongoose from "mongoose";
function connectDB() {
  mongoose
    .connect("mongodb://localhost:27017/lightning_stores")
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log("Database connection failed", err);
    });
}
export default connectDB;
