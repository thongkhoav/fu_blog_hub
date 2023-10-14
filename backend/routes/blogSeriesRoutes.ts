import express from "express";
const router = express.Router();
const blogSeriesController = require("../controllers/blogSeriesController");
const authController = require("../controllers/authController");

router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("student", "mentor"),
  blogSeriesController.checkSeriesOwnership,
  blogSeriesController.deleteSeries
);
router.post(
  "/",
  authController.protect,
  authController.restrictTo("student", "mentor"),
  blogSeriesController.createSeries
);
router.get("/", blogSeriesController.getAllSeries);
// to handle put request
module.exports = router;
