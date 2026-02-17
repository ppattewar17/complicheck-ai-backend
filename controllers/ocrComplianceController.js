const rules = require("../rules/complianceRules.json");
const keywordMap = require("../rules/keywordMap.json");
const { extractTextFromImage } = require("../services/ocrService");
const ruleMessages = require("../rules/ruleMessages");
const ComplianceResult = require("../models/ComplianceResult");


/**
 * -------------------------
 * REGEX / SEMANTIC VALIDATORS
 * -------------------------
 */
const validators = {
  // ========= FOOD =========
  product_name: (text) => text.length > 10,

  fssai_number: (text) =>
    text.includes("fssai") || /\b\d{8,14}\b/.test(text),

  net_quantity: (text) =>
    /\b\d+\s?(g|kg|ml|l)\b/i.test(text),

  mrp: (text) =>
    text.includes("mrp"),

  manufacturing_date: (text) =>
    text.includes("mfg") || text.includes("manufactured"),

  expiry_date: (text) =>
    /(expiry|best before|exp)/i.test(text),

  ingredients: (text) =>
    text.includes("ingredients"),

  manufacturer_details: (text) =>
    /(manufactured by|packed by|marketed by)/i.test(text),

  // ========= COSMETIC =========
  batch_number: (text) =>
    /(batch|lot|see top|see bottom)/i.test(text),

  expiry_date_cosmetic: (text) =>
    /(exp|expiry|use before|see top|see bottom)/i.test(text),

  manufacturer_details_cosmetic: (text) =>
    /(pvt\.?\s*ltd\.?|limited|ltd\.?|unit:|mfd\.?|manufactured by)/i.test(text),

  usage_warning: (text) =>
    /(warning|caution|for external use only)/i.test(text),

  // ========= ELECTRICAL =========
  voltage_rating: (text) =>
    /(volt|voltage|\b\d+\s?v\b|is\s?\d{2,5})/i.test(text),

  power_rating: (text) =>
    /(watt|power|\b\d+\s?w\b|is\s?\d{2,5})/i.test(text),

  isi_mark: (text) =>
    /(isi|bis|is\s?\d{2,5}:\d{4})/i.test(text),

  manufacturer_details_electrical: (text) =>
    /(pvt\.?|ltd\.?|company|manufacturer|india|address|www\.|\.in)/i.test(text),

  safety_instructions_electrical: (text) =>
    /(warning|caution|risk|electric|shock|do not|danger)/i.test(text),
};

/**
 * -------------------------
 * OCR + COMPLIANCE CHECK API
 * -------------------------
 */
exports.checkComplianceWithOCR = async (req, res) => {
  try {
    const { category } = req.body;

    // Validate input
    if (!category || !req.file) {
      return res.status(400).json({
        error: "category and image required",
      });
    }

    // Use buffer from memory storage
    const imageBuffer = req.file.buffer;

    const categoryRules = rules[category];
    const categoryKeywords = keywordMap[category];

    if (!categoryRules || !categoryKeywords) {
      return res.status(400).json({
        error: `Invalid category: ${category}`,
      });
    }

    // OCR extraction
    const extractedTextRaw = await extractTextFromImage(imageBuffer);
    console.log("OCR RAW TEXT 👉\n", extractedTextRaw);

    const text = extractedTextRaw.toLowerCase();

    let score = 0;
    let total = 0;
    let breakdown = {};

    const isiDetected = category === "electrical" && validators.isi_mark(text);

    // 3️⃣ Rule evaluation
    for (const rule in categoryRules) {
      const weight = categoryRules[rule].weight || 0;
      total += weight;

      let found = false;

      // 🧴 COSMETIC overrides
      if (category === "cosmetic") {
        if (rule === "expiry_date") {
          found = validators.expiry_date_cosmetic(text);
        } else if (rule === "manufacturer_details") {
          found = validators.manufacturer_details_cosmetic(text);
        } else if (validators[rule]) {
          found = validators[rule](text);
        }
      }

      // ⚡ ELECTRICAL overrides
      else if (category === "electrical") {
        if (rule === "manufacturer_details") {
          found = validators.manufacturer_details_electrical(text);
        } else if (rule === "safety_instructions") {
          found = validators.safety_instructions_electrical(text);
        } else if (validators[rule]) {
          found = validators[rule](text);
        }

        // 🔥 ISI-DOMINANT OVERRIDE
        if (!found && isiDetected && rule !== "isi_mark") {
          found = true;
        }
      }

      // 🍔 FOOD + default
      else if (validators[rule]) {
        found = validators[rule](text);
      }

      // Fallback keyword check
      else {
        const keywords = categoryKeywords[rule] || [];
        found = keywords.some(k => text.includes(k.toLowerCase()));
      }

      breakdown[rule] = found
        ? { status: "PASS" }
        : {
            status: "FAIL",
            reason: ruleMessages[rule]?.fail || "Rule not satisfied",
            suggestion: ruleMessages[rule]?.fix || "Check label compliance",
          };

      if (found) score += weight;
    }

    // Final score & decision
    const percentage =
      total > 0 ? Math.round((score / total) * 100) : 0;

    let status = "REJECTED";
    if (percentage >= 80) status = "APPROVED";
    else if (category === "electrical" && percentage >= 50)
      status = "NEEDS_REVIEW";
    else if (percentage >= 60) status = "NEEDS_REVIEW";

    await ComplianceResult.create({
      category,
      score: percentage,
      status,
      breakdown,
      extractedText: extractedTextRaw,
    });

    return res.json({
      category,
      score: percentage,
      status,
      extractedText: extractedTextRaw,
      breakdown,
    });

  } catch (error) {
    console.error("OCR ERROR 👉", error);

    return res.status(500).json({
      error: "OCR processing failed",
      details: error.message,
    });
  }
};
