import mongoose from "mongoose";
import Product from "./Product.js";

const saleSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantitySold: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  totalAmount: { type: Number },
  date: { type: Date, default: Date.now },
  soldBy: { type: String, required: true },
});

// Auto-calculate totalAmount
saleSchema.pre("save", function (next) {
  this.totalAmount = this.quantitySold * this.sellingPrice;
  next();
});

// Validate stock before saving
saleSchema.pre("save", async function (next) {
  const product = await Product.findById(this.product);
  if (!product) {
    return next(new Error("Product not found"));
  }
  if (product.stock < this.quantitySold) {
    return next(new Error("Not enough stock available"));
  }
  next();
});

// After sale → decrease stock
saleSchema.post("save", async function (doc) {
  const product = await Product.findById(doc.product);
  if (product) {
    product.stock -= doc.quantitySold;
    await product.save();
  }
});

const Sale = mongoose.model("Sale", saleSchema);
export default Sale;
