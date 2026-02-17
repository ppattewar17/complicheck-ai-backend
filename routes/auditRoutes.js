const express = require("express");
const router = express.Router();
const ComplianceResult = require("../models/ComplianceResult");

router.get("/history", async (req, res) => {
  const data = await ComplianceResult
    .find()
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(data);
});

module.exports = router;
