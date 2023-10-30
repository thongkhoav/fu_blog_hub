import express from "express";
const router = express.Router();
const commentController = require("../controllers/commentController");
const authController = require("./../controllers/authController");

router.post("/", authController.protect ,commentController.createComment);
router.get("/:blogId", commentController.getAllComment);
router.put("/:commentId",authController.protect, commentController.updateComment);
router.put("/delete/:commentId", authController.protect ,commentController.deleteComment);
router.put("/edit/:commentId", authController.protect,commentController.editComment);
router.put("/check/:commentId", authController.protect,commentController.checkUser);
// to handle put request
module.exports = router;
