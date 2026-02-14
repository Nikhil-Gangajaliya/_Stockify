import mongoose from "mongoose";
import { Counter } from "./counter.model.js";

const orderRequestSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    requestedQty: {
      type: Number,
      required: true,
      min: 1
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

/* ========= AUTO ORDER ID: ord_001 ========= */
orderRequestSchema.pre("save", async function () {
  if (this.orderId) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "order" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.orderId = `ord_${String(counter.seq).padStart(3, "0")}`;
});

export const OrderRequest = mongoose.model(
  "OrderRequest",
  orderRequestSchema
);
