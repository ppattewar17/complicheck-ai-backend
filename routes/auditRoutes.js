const express = require("express");
const router = express.Router();
const ComplianceResult = require("../models/ComplianceResult");

router.get("/history", async (req, res) => {
  try {
    const data = await ComplianceResult
      .find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(data);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
