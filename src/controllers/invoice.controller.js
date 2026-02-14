import mongoose from "mongoose";
import { Invoice } from "../models/invoices.model.js";
import { StoreStock } from "../models/storeStock.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ========= STORE → CREATE INVOICE (stk_001) ========= */
const createInvoice = asyncHandler(async (req, res) => {
  const { items, custName, custContact } = req.body;
  const storeId = req.store._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalAmount = 0;

    for (const item of items) {
      const stock = await StoreStock.findOne({
        storeId,
        productId: item.productId
      }).session(session);

      if (!stock || stock.qty < item.qty) {
        throw new ApiError(400, "Low stock for product");
      }

      stock.qty -= item.qty;
      await stock.save({ session });

      item.total = item.qty * item.unitPrice;
      totalAmount += item.total;
    }

    const [invoice] = await Invoice.create(
      [
        {
          storeId,
          custName,
          custContact,
          items,
          totalAmount
        }
      ],
      { session }
    );

    await session.commitTransaction();

    res
      .status(201)
      .json(new ApiResponse(201, invoice, "Invoice created"));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export { createInvoice };
