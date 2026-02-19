import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const adminSchema = new Schema(
    {
        refreshToken: {
            type: String
        },
        adminId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: false
        }
    },
    {
        timestamps: true,
    }
)

adminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

adminSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    this.refreshToken = refreshToken;
    return refreshToken;
};

adminSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});

export const Admin = mongoose.model("Admin", adminSchema);