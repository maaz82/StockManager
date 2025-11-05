import express from "express";
import Purchase from "../models/Purchase.js";

const router = express.Router();

// Add new purchase
router.post("/", async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();
    res.status(201).json({ message: "Purchase added successfully", purchase });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all purchases
router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.find().populate("product");
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
