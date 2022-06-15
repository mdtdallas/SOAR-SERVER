const rateLimit = require("express-rate-limit");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const slowDown = require("express-slow-down");
const logModel = require("./models/logModel");
const server = express();

require("dotenv").config();

const corsOptions = {
  origin: "http://localhost:3000",
  //   origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browser (IE11, various smartTvs) choke on 204
};

server.use(cors(corsOptions));
server.use(express.static("public"));
server.use(cookieParser());
server.use(express.json());
server.use(
  express.urlencoded({
    extended: true,
  })
);

server.use(cookieParser());
server.use(
  session({
    secret: "secret phrase abc123",
    resave: true,
    saveUninitialized: false,
    cookie: {
      path: "/",
      secure: false,
    }, // Should be turned to true in production (HTTPS only)
  })
);

// exress rate limiiting *********************
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 500, // 12 hour duration in milliseconds
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 24 hours)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
const speedLimiter = slowDown({
  windowMs: 500,
  delayAfter: 1,
  delayMs: 500,
});

// apply to all request
server.use(speedLimiter, limiter);
// server.user(limiter)


/// Link up the user controller
const userController = require("./controllers/userController");
server.use("/api", userController);

/// Link up the content controller
const contentController = require("./controllers/contentController");
server.use("/api", contentController);

/// Link up the injury controller
const injuryController = require("./controllers/injuryController");
server.use("/api", injuryController);

/// Link up the sport controller
const sportController = require("./controllers/sportController");
server.use("/api", sportController);

/// Link up the favorites controller
const favoritesController = require("./controllers/favoritesController");
server.use("/api", favoritesController);

/// Link up the body controller
const bodyController = require("./controllers/bodyController");
server.use("/api", bodyController);

const PORT = process.env.PORT || 3001;
// Start the express server
server.listen(PORT, () => {
  console.log(`backend is listeing on ${PORT}`);
});
