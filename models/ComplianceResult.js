const mongoose = require("mongoose");

const ComplianceResultSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["food", "cosmetic", "electrical"],
      required: true,
    },
    score: Number,
    status: String,
    breakdown: Object,
    extractedText: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ComplianceResult", ComplianceResultSchema);
