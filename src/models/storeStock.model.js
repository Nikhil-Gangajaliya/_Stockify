import mongoose, { Schema } from "mongoose";

const storeStockSchema = new Schema(
    {
        storeId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store"
        },

        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },

        storeQty: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)


export const StoreStock = mongoose.model("StoreStock", storeStockSchema);
