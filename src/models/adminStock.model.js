import mongoose from "mongoose";

const adminStockSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
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

export const AdminStock = mongoose.model("AdminStock", adminStockSchema);
