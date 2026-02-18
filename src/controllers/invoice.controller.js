import mongoose from "mongoose";
import { Invoice } from "../models/invoices.model.js";
import { StoreStock } from "../models/storeStock.model.js";
import { Product } from "../models/product.model.js";
import { Store } from "../models/store.model.js";
import { ApiError } from "../utils/ApiError.js";
import { formatInvoiceResponse } from "../utils/formatInvoice.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ========= STORE → CREATE INVOICE (stk_001) ========= */

const createInvoice = asyncHandler(async (req, res) => {
  const { items, custName, custContact } = req.body;
  const storeId = req.store._id;

  if (!items || items.length === 0) {
    throw new ApiError(400, "Invoice must contain items");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let totalAmount = 0;
    const processedItems = [];

    // ✅ 1. Collect all custom productIds
    const productIds = items.map(item => item.productId);

    // ✅ 2. Fetch all products in ONE query (performance boost)
    const products = await Product.find({
      productId: { $in: productIds }
    });

    // Convert to map for fast lookup
    const productMap = {};
    products.forEach(prod => {
      productMap[prod.productId] = prod;
    });

    for (const item of items) {

      const product = productMap[item.productId];

      if (!product) {
        throw new ApiError(404, `Product ${item.productId} not found`);
      }

      const stock = await StoreStock.findOne({
        storeId,
        productId: product._id
      }).session(session);

      if (!stock || stock.qty < item.qty) {
        throw new ApiError(400, `Low stock for ${product.productName}`);
      }

      stock.qty -= item.qty;
      await stock.save({ session });

      const price = product.sellPrice;

      if (price === undefined || isNaN(price)) {
        throw new ApiError(
          500,
          `Invalid sell price for ${product.productName}`
        );
      }

      const itemTotal = item.qty * price;
      totalAmount += itemTotal;

      processedItems.push({
        productId: product._id, // save Mongo _id internally
        qty: item.qty,
        unitPrice: price,
        total: itemTotal
      });
    }

    const [invoice] = await Invoice.create(
      [{
        storeId,
        custName,
        custContact,
        items: processedItems,
        totalAmount
      }],
      { session }
    );

    // ✅ Commit only DB work
    await session.commitTransaction();
    session.endSession();

    // ✅ Do populate AFTER transaction
    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate("storeId", "storeId storeName")
      .populate("items.productId", "productId productName");

    return res.status(201).json(
      new ApiResponse(
        201,
        formatInvoiceResponse(populatedInvoice),
        "Invoice created successfully"
      )
    );

  } catch (error) {

    // ✅ Safe abort
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    session.endSession();
    throw error;
  }
});



export { createInvoice };
