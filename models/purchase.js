import mongoose from "mongoose";
import Product from "./Product.js";

const purchaseSchema = new mongoose.Schema({
  supplier: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  totalCost: { type: Number },
  date: { type: Date, default: Date.now },
  purchasedBy: { type: String, required: true },
});

// Auto-calculate totalCost before save
purchaseSchema.pre("save", function (next) {
  this.totalCost = this.quantity * this.costPrice;
  next();
});

// After purchase → increase stock
purchaseSchema.post("save", async function (doc) {
  const product = await Product.findById(doc.product);
  if (product) {
    product.stock += doc.quantity;
    await product.save();
  }
});

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
