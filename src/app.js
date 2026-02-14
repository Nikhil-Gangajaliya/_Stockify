// express setup
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://localhost:9000"
    ],
    credentials: true
  })
);

// Body parsers
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Cookies
app.use(cookieParser());

/* ================= ROUTES ================= */
import adminRoutes from "./routes/admin.routes.js";
import storeRoutes from "./routes/store.routes.js";
import productRoutes from "./routes/product.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/store", storeRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/stock", stockRoutes);
app.use("/api/v1/invoice", invoiceRoutes);



export { app };
