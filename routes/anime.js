const express = require("express");
const router = express.Router();
const Anime = require("../models/Anime");
const { createSlug } = require("../utils/slugify");

// Get all anime
router.get("/", async (req, res) => {
  try {
    const data = await Anime.find();
    res.json(data);
  } catch (err) {
    console.error("Error fetching all anime:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get latest createdAt time for polling
router.get("/updatedAt", async (req, res) => {
  try {
    const latest = await Anime.findOne()
      .sort({ createdAt: -1 })
      .select("createdAt");
    res.json({ updatedAt: latest?.createdAt || null });
  } catch (err) {
    console.error("Error fetching updatedAt:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get anime by slug
router.get("/:slug", async (req, res) => {
  try {
    const anime = await Anime.findOne({id:req.params.slug});
    if (!anime) {
      return res
        .status(404)
        .json({ error: `Anime not found: ${req.params.slug}` });
    }
    res.json(anime);
  } catch (err) {
    console.error("Error fetching anime by slug:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get anime by IDs
router.post("/by-ids", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) return res.json([]);
    const anime = await Anime.find({ id: { $in: ids.map(String) } });
    res.json(anime);
  } catch (err) {
    console.error("Error fetching anime by IDs:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
