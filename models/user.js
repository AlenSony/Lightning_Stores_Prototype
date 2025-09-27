import mongoose from "mongoose";
import connectDB from "../database/db";

connectDB();

function createUserSchema() {
  return new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  });
}

const User = mongoose.model("User", createUserSchema());

export default User;
