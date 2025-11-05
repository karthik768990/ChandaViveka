
export const validateShlokaInput = (req, res, next) => {
  try {
    const { shloka } = req.body;

    // 1️⃣ Check if shloka is provided and is a string
    if (!shloka || typeof shloka !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid input: 'shloka' must be provided as a string.",
      });
    }

    // 2️⃣ Trim and normalize whitespace
    const normalized = shloka.trim();
    if (normalized.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input: 'shloka' cannot be empty.",
      });
    }

    // 3️⃣ Optional: Prevent excessively long input
    if (normalized.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Input too long: please limit your shloka to under 1000 characters.",
      });
    }

    // 4️⃣ Optional: Remove unwanted control characters or HTML tags
    const cleaned = normalized.replace(/<[^>]*>?/gm, ""); // remove HTML tags

    // Attach cleaned version to the request body
    req.body.shloka = cleaned;

    // ✅ Proceed to the controller
    next();
  } catch (error) {
    console.error("Error in input validation middleware:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during input validation.",
    });
  }
};
