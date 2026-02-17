const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { checkComplianceWithOCR } = require("../controllers/ocrComplianceController");

router.post(
  "/check-compliance-ocr",
  upload.single("image"),
  checkComplianceWithOCR
);

module.exports = router;
