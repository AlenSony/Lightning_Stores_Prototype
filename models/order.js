import mongoose from "mongoose";

function OrderSchema() {
  return new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    order_date: {
      type: Date,
      default: Date.now,
    },
  });

  const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema());
  return Order;
}

export default Order;
