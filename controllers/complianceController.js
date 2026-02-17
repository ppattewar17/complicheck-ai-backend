const rules = require("../rules/complianceRules.json");
const keywordMap = require("../rules/keywordMap.json");

exports.checkCompliance = (req, res) => {
  const { category, extractedText } = req.body;

  // Validate input
  if (!category || !extractedText) {
    return res.status(400).json({
      error: "category and extractedText required",
    });
  }

  const categoryRules = rules[category];
  const categoryKeywords = keywordMap[category];

  // Validate category
  if (!categoryRules || !categoryKeywords) {
    return res.status(400).json({
      error: `Invalid category: ${category}`,
    });
  }

  console.log("Checking category:", category);
  console.log("Extracted text:", extractedText);

  let score = 0;
  let total = 0;
  let result = {};

  const text = extractedText.toLowerCase();

  for (const rule in categoryRules) {
    const ruleWeight = categoryRules[rule].weight || 0;
    total += ruleWeight;

    const keywords = categoryKeywords[rule] || [];
    const found = keywords.some((k) => text.includes(k.toLowerCase()));

    result[rule] = found ? "PASS" : "FAIL";

    if (found) {
      score += ruleWeight;
    }
  }

  // Prevent divide-by-zero
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  let status = "REJECTED";
  if (percentage >= 75) status = "APPROVED";
  else if (percentage >= 50) status = "NEEDS_REVIEW";

  return res.json({
    category,
    score: percentage,
    status,
    breakdown: result,
  });
};
