const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const animeRouter = require("./routes/anime");
const sendOtpRoute = require("./routes/auth/sendOtp");
const verifyOtpRoute = require("./routes/auth/verifyOtp");
const cloudinaryRouter = require("./routes/cloudinary");

dotenv.config();

// Validate environment variables
const requiredEnvVars = [
  "MONGO_URI",
  "PORT",
  "EMAIL_SENDER",
  "EMAIL_PASSWORD",
  "FRONTEND_URL",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_UPLOAD_PRESET",
];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);
if (missingEnvVars.length > 0) {
  console.error(
    `❌ Missing environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

// Validate FRONTEND_URL format
const origins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:3000"];
if (!origins.every((url) => /^https?:\/\/.+$/.test(url))) {
  console.error("❌ Invalid FRONTEND_URL format in .env");
  process.exit(1);
}

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: origins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        connectSrc: origins.concat(["api.cloudinary.com"]),
      },
    },
  })
);
app.use(
  compression({
    level: 6,
    threshold: 1024,
  })
);
app.use(hpp());
app.use(mongoSanitize());

// Rate limiting for sensitive endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests, please try again later.",
});

const authorisedClients = ["https://hinanime.site", "http://localhost:3000"];

app.use((req, res, next) => {
  if (!authorisedClients.includes(req.headers.origin)) {
    res.json({
      status: 401,
      error: "Unauthorized",
      message: "Authentication credentials were missing or invalid.",
    });
  }else{
    next();
  }
});

app.use("/api/auth", apiLimiter);
app.use("/api/cloudinary", apiLimiter);

// Routes
app.use("/api/anime", animeRouter);
app.use("/api/auth/send-otp", sendOtpRoute);
app.use("/api/auth/verify-otp", verifyOtpRoute);
app.use("/api/cloudinary", cloudinaryRouter);

app.get("/", (req, res) => {
  res.send("✅ Hin-Anime backend is running!");
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
