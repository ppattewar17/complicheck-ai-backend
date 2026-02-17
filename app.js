const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
require("dotenv").config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Only listen if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

module.exports = app;
const complianceRoutes = require("./routes/complianceRoutes");

app.use("/api", complianceRoutes);

const ocrComplianceRoutes = require("./routes/ocrComplianceRoutes");

app.use("/api", ocrComplianceRoutes);
const auditRoutes = require("./routes/auditRoutes");
app.use("/api/audit", auditRoutes);

// Export for Vercel serverless
module.exports = app;
