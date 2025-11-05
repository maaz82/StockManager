import express from "express";
import Sale from "../models/Sale.js";

const router = express.Router();

// Add new sale
router.post("/", async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.status(201).json({ message: "Sale added successfully", sale });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().populate("product");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
      
