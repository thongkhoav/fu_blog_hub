import express, { Request, Response, NextFunction } from "express";
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const passport = require('passport');
const cookieSession = require("cookie-session");

const uploadRouter = require("./routes/uploadRouter");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const googleRoutes = require("./routes/googleRoutes");
const tagRoutes = require("./routes/tagRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const { globalErrHandler } = require("./controllers/errorController");

const multer = require("multer");
import './passport'
import AppError from "./utils/appError";
const app = express();

// Allow Cross-Origin requests
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Configure passport middleware
app.use(
  cookieSession({ name: "session", keys: ["cus"], maxAge: 24 * 60 * 60 * 100 })
);
app.use(passport.initialize());
app.use(passport.session());

// Set security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Limit request from the same API
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this IP, please try again in an hour",
});

app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: "15kb",
  })
);

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Routes
app.use("/api/auth", googleRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/upload", uploadRouter);

app.use(globalErrHandler);
const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "FUBlogHub",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
    },
    components: {
      securitySchemes: {
        BeerToken: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
        },
      },
    },
  },
  apis: ["./dist/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

// handle undefined Routes
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(404, "fail", "undefined route");
  next(err);
});

module.exports = app;
