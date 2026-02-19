import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Counter } from "./counter.model.js";

const storeSchema = new Schema(
  {
    storeId: {
      type: String,
      unique: true
    },
    firmName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    contact: {
      type: Number,
      required: true
    },
    commission: {
      type: Number,
      required: true
    },
    password: {
      type: String,
      required: true,
      select: false
    }
  },
  { timestamps: true }
);

/* ========= AUTO STORE ID: str_001 ========= */
storeSchema.pre("save", async function () {
  if (this.storeId) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "store" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.storeId = `str_${String(counter.seq).padStart(3, "0")}`;
});

/* ========= PASSWORD HASH ========= */
storeSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

/* ========= AUTH METHODS ========= */
storeSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

storeSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

storeSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});


export const Store = mongoose.model("Store", storeSchema);
