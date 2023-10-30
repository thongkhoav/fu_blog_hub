import express from "express";
const router = express.Router();
const blogSeriesController = require("../controllers/blogSeriesController");
const authController = require("../controllers/authController");

router
  .route("/:id")
  .get(blogSeriesController.getBlogsOfSeries)
  .put(
    authController.protect,
    authController.restrictTo("student", "mentor"),
    blogSeriesController.checkSeriesOwnership,
    blogSeriesController.updateSeries
  )
  .delete(
    authController.protect,
    authController.restrictTo("student", "mentor"),
    blogSeriesController.checkSeriesOwnership,
    blogSeriesController.deleteSeries
  );

router.route("/:id/blogs").get(blogSeriesController.getBlogsOfSeries);

router.post(
  "/",
  authController.protect,
  authController.restrictTo("student", "mentor"),
  blogSeriesController.createSeries
);
router.get("/", blogSeriesController.getAllSeries);
router.get("/user/:id", blogSeriesController.getProfileSeries);
// to handle put request
module.exports = router;
