import mongoose from "mongoose";
import dotenv from "dotenv";
import { Invoice } from "../src/models/invoices.model.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to DB");

    const invoices = await Invoice.find();

    for (let invoice of invoices) {

      // Random date within last 180 days
      const randomDays = Math.floor(Math.random() * 180);
      const newDate = new Date();
      newDate.setDate(newDate.getDate() - randomDays);

      invoice.createdAt = newDate;
      invoice.updatedAt = newDate;

      await invoice.save({ timestamps: false });
    }

    console.log("Invoices updated with random dates");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();