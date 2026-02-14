import mongoose, { Schema } from "mongoose";
import { Counter } from "./counter.model.js";

const productSchema = new Schema(
  {
    productId: {
      type: String,
      unique: true
    },
    productName: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    costPrice: {
      type: Number,
      required: true
    },
    sellPrice: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

/* ========= AUTO PRODUCT ID: prd_001 ========= */
productSchema.pre("save", async function () {
  if (this.productId) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "product" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.productId = `prd_${String(counter.seq).padStart(3, "0")}`;
});

export const Product = mongoose.model("Product", productSchema);
