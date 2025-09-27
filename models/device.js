import mongoose from "mongoose";
import connectDB from "../database/db.js";

connectDB();

function createDeviceSchema() {
  return new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
    },
  });
}
const Device = mongoose.model("Device", createDeviceSchema());

export default Device;
