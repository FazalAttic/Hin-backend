const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema(
  {
    title: String,
    url: String,
  },
  { timestamps: true }
);

const AnimeSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    youtube: String,
    animeyear: Number,
    animeduration: Number,
    season: Number,
    totalEpisodes: Number,
    Status: String,
    imdbRating: Number,
    description: String,
    imageUrl: String,
    animeUrl: String,
    genres: [String],
    episodes: [EpisodeSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Anime", AnimeSchema);
