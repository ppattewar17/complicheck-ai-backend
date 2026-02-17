const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes
const complianceRoutes = require("./routes/complianceRoutes");
const ocrComplianceRoutes = require("./routes/ocrComplianceRoutes");
const auditRoutes = require("./routes/auditRoutes");

app.use("/api", complianceRoutes);
app.use("/api", ocrComplianceRoutes);
app.use("/api/audit", auditRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "CompliCheck API is running" });
});

// Local development only
if (process.env.NODE_ENV !== 'production') {
  connectDB();
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

module.exports = app;
