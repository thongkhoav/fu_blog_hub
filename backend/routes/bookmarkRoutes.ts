import express from "express";
const router = express.Router();
const bookmarkController = require("../controllers/bookmarkController");
const authController = require("./../controllers/authController");

router.put(
  "/:blogId/remove",
  authController.protect,
  bookmarkController.removeBookmark
);

router.post("/:blogId", authController.protect, bookmarkController.addBookmark);
router.get("/", authController.protect, bookmarkController.getBookmarkedBlogs);
module.exports = router;
