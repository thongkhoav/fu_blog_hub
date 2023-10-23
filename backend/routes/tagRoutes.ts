const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");
const authController = require("./../controllers/authController");

router
  .route("/:id")
  .put(tagController.updateTag)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    tagController.deleteTag
  );
router
  .route("/")
  .get(tagController.getAllTag)
  .post(authController.protect, tagController.createTag);
// to handle put request
module.exports = router;
