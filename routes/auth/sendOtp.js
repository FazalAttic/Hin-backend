const express = require("express");
const nodemailer = require("nodemailer");
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
  ],
  validate,
  async (req, res) => {
    const { email } = req.body;

    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Store OTP in MongoDB
      await OTPStore.findOneAndUpdate(
        { email },
        { otp, expiresAt },
        { upsert: true, new: true }
      );

      // Create transporter using Gmail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_SENDER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"HinAnime OTP" <${process.env.EMAIL_SENDER}>`,
        to: email,
        subject: "Verify your Email (OTP)",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #6d28d9;">HinAnime Email Verification</h2>
            <p>Your verification code is:</p>
            <div style="background: #6d28d9; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; border-radius: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This code will expire in 5 minutes.</p>
            <p style="font-size: 12px; color: #777; margin-top: 30px;">If you didn't request this code, you can safely ignore this email.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`OTP sent to ${email}`);
      return res.status(200).json({ message: "OTP sent" });
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error);
      return res.status(500).json({ error: "Failed to send OTP" });
    }
  }
);

module.exports = router;
