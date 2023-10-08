import express from "express";
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authController = require("./../controllers/authController");

router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  categoryController.deleteCategory
);
router.post("/", authController.protect, categoryController.createCategory);
router.get("/", categoryController.getAllCategory);
module.exports = router;
