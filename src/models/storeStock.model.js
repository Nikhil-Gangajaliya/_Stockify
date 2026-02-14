import mongoose, { Schema } from "mongoose";

const storeStockSchema = new Schema(
  {
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
    qty: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

export const StoreStock = mongoose.model("StoreStock", storeStockSchema);
