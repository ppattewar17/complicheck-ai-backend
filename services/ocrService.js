const Tesseract = require("tesseract.js");

exports.extractTextFromImage = async (imageInput) => {
  // Handle both file paths (string) and memory buffers
  const result = await Tesseract.recognize(
    imageInput,
    "eng",
    {
      tessedit_pageseg_mode: 6,
      preserve_interword_spaces: 1,
      logger: m => console.log(m.status)
    }
  );

  return result.data.text.replace(/\s+/g, " ");
};
