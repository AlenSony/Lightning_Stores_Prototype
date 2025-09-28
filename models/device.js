import mongoose from "mongoose";
import connectDB from "../database/db.js";

connectDB();

function createDeviceSchema() {
  return new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ram: {
      type: String,
      required: true,
    },
    storage: {
      type: String,
      required: true,
    },
    expected_price: {
      type: Number,
      required: true,
    },
    actual_price: {
      type: String,
      required: true,
    },
    stock: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
  });
}

const Device = mongoose.model("Device", createDeviceSchema());

export default Device;
