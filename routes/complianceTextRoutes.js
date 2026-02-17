const express = require("express");
const router = express.Router();
const { checkComplianceWithText } = require("../controllers/complianceController");

router.post("/check-compliance", checkComplianceWithText);

module.exports = router;
