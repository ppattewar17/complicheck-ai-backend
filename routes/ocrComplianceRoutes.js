const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { checkComplianceWithOCR } = require("../controllers/ocrComplianceController");

router.post(
  "/check-compliance-ocr",
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({ error: "File upload failed", details: err.message });
      }
      next();
    });
  },
  checkComplianceWithOCR
);

module.exports = router;
