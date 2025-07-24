const express = require("express");
const { body } = require("express-validator");
const validate = require("../../middleware/validate");
const OTPStore = require("../../models/OTPStore");
const router = express.Router();

router.post(
  "/",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email format"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage("OTP must be a 6-digit number"),
  ],
  validate,
  async (req, res) => {
    const { email, otp } = req.body;

    try {
      const storedOtp = await OTPStore.findOne({ email });

      if (!storedOtp) {
        return res.status(400).json({ error: "OTP expired or not found" });
      }

      if (storedOtp.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      if (Date.now() > storedOtp.expiresAt) {
        await OTPStore.deleteOne({ email });
        return res.status(400).json({ error: "OTP expired" });
      }

      // Clear the OTP after successful verification
      await OTPStore.deleteOne({ email });
      console.log(`OTP verified and cleared for ${email}`);

      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error(`OTP verification error for ${email}:`, error);
      return res.status(500).json({ error: "Failed to verify OTP" });
    }
  }
);

module.exports = router;
