const express = require("express");
const router = express.Router();
const Supplier = require("../models/Supplier");

// POST /api/suppliers → Add supplier
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address, companyName } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const supplier = new Supplier({ name, email, phone, address, companyName });
    await supplier.save();

    res.status(201).json({ message: "Supplier added", supplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/suppliers → All suppliers
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/suppliers/:id → Single supplier
router.get("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Not found" });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/suppliers/:id → Update supplier
router.put("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!supplier) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated", supplier });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/suppliers/:id → Delete supplier
router.delete("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
