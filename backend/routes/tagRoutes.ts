const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");
const authController = require("./../controllers/authController");

router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  tagController.deleteTag
);
router.post("/", authController.protect, tagController.createTag);
router.get("/", tagController.getAllTag);
module.exports = router;
