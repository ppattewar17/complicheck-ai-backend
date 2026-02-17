const express = require("express");
const router = express.Router();
const { checkCompliance } = require("../controllers/complianceController");

router.post("/check-compliance", checkCompliance);

module.exports = router;
