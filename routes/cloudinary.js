const express = require("express");
const crypto = require("crypto");
const router = express.Router();

router.post("/signature", (req, res) => {
  if (
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET ||
    !process.env.CLOUDINARY_CLOUD_NAME
  ) {
    return res.status(500).json({ error: "Cloudinary configuration missing" });
  }
  const timestamp = Math.round(Date.now() / 1000);
  const params = {
    timestamp,
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || "hinanime",
    overwrite: true,
  };
  const signatureStr =
    Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&") + process.env.CLOUDINARY_API_SECRET;
  const signature = crypto
    .createHash("sha1")
    .update(signatureStr)
    .digest("hex");

  res.json({
    signature,
    timestamp,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    upload_preset: params.upload_preset,
  });
});

module.exports = router;
