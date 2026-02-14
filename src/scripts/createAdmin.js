import mongoose from "mongoose";
import dotenv from "dotenv";
import { Admin } from "../models/admin.model.js";

dotenv.config();

/* ========= DB CONNECTION ========= */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
};

/* ========= CREATE ADMIN ========= */
const createAdmin = async () => {
  try {
    await connectDB();

    const adminId = "admin_001";   // 👈 change if needed
    const password = "admin123";   // 👈 change before production
    const name = "Super Admin";

    // check if admin already exists
    const existingAdmin = await Admin.findOne({ adminId });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const admin = await Admin.create({
      adminId,
      name,
      password
    });

    console.log("✅ Admin created successfully");
    console.log({
      adminId: admin.adminId,
      name: admin.name
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
