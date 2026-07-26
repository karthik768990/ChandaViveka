export const validateShlokaInput = (req, res, next) => {
  try {
    const { shloka } = req.body;

    if (!shloka || typeof shloka !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid input: 'shloka' must be provided as a string.",
      });
    }


    const normalized = shloka.trim();
    if (normalized.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input: 'shloka' cannot be empty.",
      });
    }

    if (normalized.length > 1000) {
      return res.status(400).json({
        success: false,
        message:
          "Input too long: please limit your shloka to under 1000 characters.",
      });
    }

    const cleaned = normalized.replace(/<[^>]*>?/gm, ""); // remove HTML tags

    req.body.shloka = cleaned;

    next();
  } catch (error) {
    console.error("Error in input validation middleware:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during input validation.",
    });
  }
};
