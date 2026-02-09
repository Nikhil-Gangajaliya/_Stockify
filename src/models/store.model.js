import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const storeSchema = new Schema(
    {
        refreshToken: {
            type: String
        },
        storeId: {
            type: String,
            required: true
        },
        firmName: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        contact: {
            type: Number,
            required: true,
        },
        commission: {
            type: Number,
            required: true,
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
)

storeSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

storeSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

storeSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

storeSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    this.refreshToken = refreshToken;
    return refreshToken;
};


export const Store = mongoose.model("Store", storeSchema);