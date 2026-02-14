import mongoose, { Schema } from "mongoose";
import { Counter } from "./counter.model.js";

const invoiceSchema = new Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
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
                    required: true
                },
                unitPrice: {
                    type: Number,
                    required: true
                },
                total: {
                    type: Number,
                    required: true
                }
            }
        ],

        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true
        },

        custName: {
            type: String,
            required: true
        },

        custContact: {
            type: Number,
            required: true
        },

        qty: {
            type: Number,
            required: true
        },

        unitPrice: {
            type: Number,
            required: true
        },

        totalAmount: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

invoiceSchema.pre("save", async function (next) {
    if (this.invoiceNumber) return next();

    const counter = await Counter.findOneAndUpdate(
        { name: "invoice" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    this.invoiceNumber = `stk_${String(counter.seq).padStart(3, "0")}`;
    next();
});

export const Invoice = mongoose.model("Invoice", invoiceSchema);