import mongoose, { Schema } from "mongoose";
import { Counter } from "./counter.model.js";

const invoiceSchema = new Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        qty: {
          type: Number,
          required: true,
          min: 1
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0
        },
        total: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],

    custName: {
      type: String,
      required: true,
      trim: true
    },

    custContact: {
      type: String,
      required: true
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: false
  }
);

/* ========= AUTO INVOICE NUMBER ========= */
invoiceSchema.pre("save", async function () {
  if (this.invoiceNumber) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "invoice" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.invoiceNumber = `stk_${String(counter.seq).padStart(3, "0")}`;
});


export const Invoice = mongoose.model("Invoice", invoiceSchema);
