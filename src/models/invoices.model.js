import mongoose, { Schema } from "mongoose";

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

export const Invoice = mongoose.model("Invoice", invoiceSchema);