import express from "express";
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authController = require("./../controllers/authController");

router
  .route("/:id")
  .put(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.deleteCategory
  );
router.post("/", authController.protect, categoryController.createCategory);
router.get("/", categoryController.getAllCategory);
// to handle put request
module.exports = router;
