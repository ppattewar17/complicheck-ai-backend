const Tesseract = require("tesseract.js");

exports.extractTextFromImage = async (imagePath) => {
  const result = await Tesseract.recognize(
    imagePath,
    "eng",
    {
      tessedit_pageseg_mode: 6,
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:/.-₹%",
      preserve_interword_spaces: 1,
      logger: m => console.log(m.status)
    }
  );

  return result.data.text;
};

exports.extractTextFromImage = async (imagePath) => {
  const result = await Tesseract.recognize(
    imagePath,
    "eng",
    {
      tessedit_pageseg_mode: 6,
      preserve_interword_spaces: 1,
      logger: m => console.log(m.status)
    }
  );

  return result.data.text.replace(/\s+/g, " ");
};
